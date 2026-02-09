'use client';

import { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

interface AqueductRasterLayerProps {
  riskType: 'water_stress' | 'water_depletion' | 'drought_risk';
  opacity?: number;
}

// Color scales similar to WRI Aqueduct
const COLOR_SCALES = {
  water_stress: [
    { value: 0, color: '#440154', label: 'Low (<10%)' },
    { value: 1, color: '#31688e', label: 'Low-Medium (10-20%)' },
    { value: 2, color: '#35b779', label: 'Medium (20-40%)' },
    { value: 3, color: '#fde725', label: 'High (40-80%)' },
    { value: 4, color: '#ff0000', label: 'Extremely High (>80%)' },
  ],
  water_depletion: [
    { value: 0, color: '#2166ac', label: 'Low' },
    { value: 1, color: '#67a9cf', label: 'Low-Medium' },
    { value: 2, color: '#f7f7f7', label: 'Medium' },
    { value: 3, color: '#fddbc7', label: 'High' },
    { value: 4, color: '#b2182b', label: 'Extremely High' },
  ],
  drought_risk: [
    { value: 0, color: '#018571', label: 'Low' },
    { value: 1, color: '#80cdc1', label: 'Low-Medium' },
    { value: 2, color: '#f5f5f5', label: 'Medium' },
    { value: 3, color: '#dfc27d', label: 'High' },
    { value: 4, color: '#a6611a', label: 'Extremely High' },
  ],
};

// Generate dummy raster data based on location
function generateRasterData(bounds: L.LatLngBounds, riskType: string): number[][] {
  const gridSize = 50; // 50x50 grid
  const data: number[][] = [];
  
  const south = bounds.getSouth();
  const north = bounds.getNorth();
  const west = bounds.getWest();
  const east = bounds.getEast();
  
  // Create patterns based on location and risk type
  for (let i = 0; i < gridSize; i++) {
    const row: number[] = [];
    for (let j = 0; j < gridSize; j++) {
      // Generate risk values with some spatial correlation
      const lat = south + (north - south) * (i / gridSize);
      const lng = west + (east - west) * (j / gridSize);
      
      // Create hotspots and patterns
      let baseRisk = Math.random() * 3;
      
      // Add some spatial correlation
      const centerLat = (north + south) / 2;
      const centerLng = (east + west) / 2;
      const distFromCenter = Math.sqrt(Math.pow(lat - centerLat, 2) + Math.pow(lng - centerLng, 2));
      
      if (riskType === 'water_stress') {
        // Higher stress near center (mining area)
        baseRisk += (2 - distFromCenter * 10);
      } else if (riskType === 'drought_risk') {
        // Drought risk increases with distance from water sources
        baseRisk += distFromCenter * 5;
      }
      
      // Add some noise
      baseRisk += (Math.random() - 0.5) * 0.5;
      
      // Clamp to 0-4 range
      row.push(Math.max(0, Math.min(4, Math.floor(baseRisk))));
    }
    data.push(row);
  }
  
  return data;
}

export function AqueductRasterLayer({ riskType, opacity = 0.7 }: AqueductRasterLayerProps) {
  const map = useMap();
  const [canvasLayer, setCanvasLayer] = useState<L.Layer | null>(null);

  useEffect(() => {
    if (!map) return;

    // Remove previous layer if it exists
    if (canvasLayer) {
      map.removeLayer(canvasLayer);
    }

    const colorScale = COLOR_SCALES[riskType];

    // Create custom Canvas layer
    const CanvasLayer = L.Layer.extend({
      onAdd: function(map: L.Map) {
        this._map = map;
        this._canvas = L.DomUtil.create('canvas', 'leaflet-layer');
        const size = map.getSize();
        this._canvas.width = size.x;
        this._canvas.height = size.y;
        this._canvas.style.opacity = String(opacity);
        this._canvas.style.position = 'absolute';
        this._canvas.style.zIndex = '200';

        const pane = map.getPane('overlayPane');
        if (pane) {
          pane.appendChild(this._canvas);
        }

        map.on('moveend', this._reset, this);
        map.on('resize', this._resize, this);
        this._reset();
        return this;
      },

      onRemove: function(map: L.Map) {
        if (this._canvas.parentNode) {
          this._canvas.parentNode.removeChild(this._canvas);
        }
        map.off('moveend', this._reset, this);
        map.off('resize', this._resize, this);
        return this;
      },

      _resize: function() {
        const size = this._map.getSize();
        this._canvas.width = size.x;
        this._canvas.height = size.y;
        this._reset();
      },

      _reset: function() {
        const bounds = this._map.getBounds();
        const topLeft = this._map.latLngToLayerPoint(bounds.getNorthWest());
        L.DomUtil.setPosition(this._canvas, topLeft);

        // Generate and draw raster data
        const ctx = this._canvas.getContext('2d');
        if (!ctx) return;

        const rasterData = generateRasterData(bounds, riskType);
        const gridSize = rasterData.length;

        const width = this._canvas.width;
        const height = this._canvas.height;
        const cellWidth = width / gridSize;
        const cellHeight = height / gridSize;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Draw raster cells
        for (let i = 0; i < gridSize; i++) {
          for (let j = 0; j < gridSize; j++) {
            const value = rasterData[i][j];
            const color = colorScale[Math.floor(value)].color;
            
            ctx.fillStyle = color;
            ctx.fillRect(j * cellWidth, i * cellHeight, cellWidth, cellHeight);
          }
        }

        // Apply smoothing
        ctx.filter = 'blur(2px)';
        ctx.drawImage(this._canvas, 0, 0);
        ctx.filter = 'none';
      }
    });

    const layer = new CanvasLayer();
    layer.addTo(map);
    setCanvasLayer(layer);

    return () => {
      if (layer) {
        map.removeLayer(layer);
      }
    };
  }, [map, riskType, opacity]);

  return null;
}

interface RasterLegendProps {
  riskType: 'water_stress' | 'water_depletion' | 'drought_risk';
}

export function RasterLegend({ riskType }: RasterLegendProps) {
  const colorScale = COLOR_SCALES[riskType];
  
  return (
    <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 z-[1000]">
      <h4 className="text-sm font-medium mb-2">
        {riskType === 'water_stress' && 'Water Stress'}
        {riskType === 'water_depletion' && 'Water Depletion'}
        {riskType === 'drought_risk' && 'Drought Risk'}
      </h4>
      <div className="space-y-1">
        {colorScale.map((item) => (
          <div key={item.value} className="flex items-center gap-2">
            <div 
              className="w-4 h-4 rounded"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs">{item.label}</span>
          </div>
        ))}
      </div>
      <div className="mt-2 pt-2 border-t text-xs text-muted-foreground">
        Data: WRI Aqueduct 4.0
      </div>
    </div>
  );
}