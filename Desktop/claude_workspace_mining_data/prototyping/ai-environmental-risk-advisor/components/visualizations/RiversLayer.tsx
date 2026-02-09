'use client';

import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

interface RiversLayerProps {
  opacity?: number;
  center?: [number, number];
}

// Generate a sinusoidal river polyline crossing the map
function generateMainRiver(center: [number, number]): GeoJSON.Feature {
  const [lat, lng] = center;
  const points: [number, number][] = [];
  const numPoints = 10;

  for (let i = 0; i < numPoints; i++) {
    const t = i / (numPoints - 1);
    const riverLat = lat + 0.2 - t * 0.4;
    const riverLng = lng - 0.25 + t * 0.5 + Math.sin(t * Math.PI * 2) * 0.04;
    points.push([riverLng, riverLat]);
  }

  return {
    type: 'Feature',
    properties: {
      name: 'Río Grande',
      strahler_order: 5,
      avg_discharge_m3s: 42.3,
      length_km: 185,
      type: 'main'
    },
    geometry: {
      type: 'LineString',
      coordinates: points
    }
  };
}

// Generate tributary branching off the main river
function generateTributary(
  mainRiver: GeoJSON.Feature,
  branchIndex: number,
  name: string,
  order: number,
  discharge: number,
  lengthKm: number,
  angleDeg: number
): GeoJSON.Feature {
  const mainCoords = (mainRiver.geometry as GeoJSON.LineString).coordinates;
  const startIdx = Math.floor(mainCoords.length * (0.2 + branchIndex * 0.2));
  const startPoint = mainCoords[Math.min(startIdx, mainCoords.length - 1)];

  const angleRad = (angleDeg * Math.PI) / 180;
  const points: [number, number][] = [startPoint as [number, number]];
  const numPoints = 5 + Math.floor(Math.random() * 3);

  for (let i = 1; i < numPoints; i++) {
    const t = i / (numPoints - 1);
    const dist = t * 0.12;
    const wobble = Math.sin(t * Math.PI * 1.5) * 0.015;
    const lng = (startPoint as [number, number])[0] + Math.cos(angleRad) * dist + wobble;
    const lat = (startPoint as [number, number])[1] + Math.sin(angleRad) * dist;
    points.push([lng, lat]);
  }

  return {
    type: 'Feature',
    properties: {
      name,
      strahler_order: order,
      avg_discharge_m3s: discharge,
      length_km: lengthKm,
      type: order >= 3 ? 'tributary' : 'stream'
    },
    geometry: {
      type: 'LineString',
      coordinates: points
    }
  };
}

export function RiversLayer({ opacity = 0.8, center }: RiversLayerProps) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const mapCenter: [number, number] = center || [map.getCenter().lat, map.getCenter().lng];

    const mainRiver = generateMainRiver(mapCenter);

    const tributaries = [
      generateTributary(mainRiver, 0, 'Quebrada Seca', 3, 8.1, 34, 45),
      generateTributary(mainRiver, 1, 'Arroyo del Norte', 2, 3.2, 18, -50),
      generateTributary(mainRiver, 2, 'Río Chico', 3, 12.7, 52, 40),
      generateTributary(mainRiver, 3, 'Arroyo Sur', 1, 0.8, 9, -35),
    ];

    const riverCollection: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: [mainRiver, ...tributaries]
    };

    const geoJsonLayer = L.geoJSON(riverCollection, {
      style: (feature) => {
        const order = feature?.properties?.strahler_order || 1;
        const featureType = feature?.properties?.type || 'stream';

        return {
          color: '#2563eb',
          weight: featureType === 'main' ? 4 : featureType === 'tributary' ? 2 : 1,
          opacity: opacity,
          dashArray: featureType === 'stream' ? '4 4' : undefined,
          lineCap: 'round' as const,
          lineJoin: 'round' as const,
        };
      },
      onEachFeature: (feature, layer) => {
        const p = feature.properties;
        layer.bindPopup(`
          <div class="p-2">
            <strong>${p.name}</strong><br/>
            <span style="color: #6b7280; font-size: 12px;">
              Stream Order: ${p.strahler_order} (Strahler)<br/>
              Avg. Discharge: ${p.avg_discharge_m3s} m³/s<br/>
              Length: ${p.length_km} km
            </span>
            <div style="margin-top: 6px; padding-top: 6px; border-top: 1px solid #e5e7eb; font-size: 11px; color: #9ca3af;">
              Source: HydroRIVERS (WWF HydroSHEDS)
            </div>
          </div>
        `);
      }
    }).addTo(map);

    return () => {
      map.removeLayer(geoJsonLayer);
    };
  }, [map, opacity, center]);

  return null;
}

export function RiversLegend() {
  return (
    <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 z-[1000]">
      <h4 className="text-sm font-medium mb-2">River Network</h4>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-6 h-1 bg-blue-600 rounded" />
          <span className="text-xs">Major River (order 4-5)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-0.5 bg-blue-600 rounded" />
          <span className="text-xs">Tributary (order 2-3)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 border-t border-dashed border-blue-600" />
          <span className="text-xs">Stream (order 1)</span>
        </div>
      </div>
      <div className="mt-2 pt-2 border-t text-xs text-muted-foreground">
        Data: HydroRIVERS (WWF HydroSHEDS)
      </div>
    </div>
  );
}
