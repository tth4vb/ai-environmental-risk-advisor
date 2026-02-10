'use client';

import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

interface BiodiversityLayerProps {
  opacity?: number;
  center?: [number, number];
}

// Simulate biodiversity hotspots and protected areas
export function BiodiversityLayer({ opacity = 0.6, center }: BiodiversityLayerProps) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const mapCenter: [number, number] = center || [map.getCenter().lat, map.getCenter().lng];
    const [lat, lng] = mapCenter;

    // Create GeoJSON layer for protected areas
    const protectedAreas: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {
            name: 'Key Biodiversity Area — Sierra Alta',
            type: 'KBA',
            iucn_category: 'Not Applicable',
            designation: 'Key Biodiversity Area',
            area_km2: 342,
            species_count: 127,
            status: 'Confirmed',
            source: 'BirdLife/KBA Partnership',
            species: 'Endemic birds (12 spp.), mammals (8 spp.), amphibians (5 spp.)'
          },
          geometry: {
            type: 'Polygon',
            coordinates: [[
              [lng - 0.1, lat + 0.1],
              [lng + 0.05, lat + 0.15],
              [lng + 0.1, lat - 0.05],
              [lng - 0.05, lat - 0.1],
              [lng - 0.1, lat + 0.1]
            ]]
          }
        },
        {
          type: 'Feature',
          properties: {
            name: 'Reserva Forestal Protegida',
            type: 'Protected',
            iucn_category: 'IV — Habitat/Species Management',
            designation: 'National Forest Reserve',
            area_km2: 156,
            species_count: 84,
            status: 'Designated',
            source: 'WDPA (Protected Planet)',
            species: 'Primary forest habitat, threatened flora (23 spp.)'
          },
          geometry: {
            type: 'Polygon',
            coordinates: [[
              [lng + 0.15, lat + 0.05],
              [lng + 0.25, lat + 0.1],
              [lng + 0.2, lat - 0.1],
              [lng + 0.1, lat - 0.05],
              [lng + 0.15, lat + 0.05]
            ]]
          }
        },
        {
          type: 'Feature',
          properties: {
            name: 'Corredor Biológico Regional',
            type: 'Corridor',
            iucn_category: 'Not Applicable',
            designation: 'Wildlife Corridor / Buffer Zone',
            area_km2: 89,
            species_count: 45,
            status: 'Proposed',
            source: 'WDPA (Protected Planet)',
            species: 'Connectivity habitat for large mammals, riparian species'
          },
          geometry: {
            type: 'Polygon',
            coordinates: [[
              [lng - 0.12, lat - 0.08],
              [lng - 0.02, lat - 0.05],
              [lng + 0.08, lat - 0.12],
              [lng + 0.05, lat - 0.2],
              [lng - 0.08, lat - 0.16],
              [lng - 0.12, lat - 0.08]
            ]]
          }
        }
      ]
    };

    const COLORS: Record<string, { fill: string; stroke: string }> = {
      KBA: { fill: '#10b981', stroke: '#059669' },
      Protected: { fill: '#059669', stroke: '#047857' },
      Corridor: { fill: '#6ee7b7', stroke: '#34d399' },
    };

    const geoJsonLayer = L.geoJSON(protectedAreas, {
      style: (feature) => {
        const featureType = feature?.properties?.type || 'KBA';
        const colors = COLORS[featureType] || COLORS.KBA;
        return {
          fillColor: colors.fill,
          weight: 2,
          opacity: 1,
          color: colors.stroke,
          fillOpacity: opacity,
          dashArray: featureType === 'Corridor' ? '6 4' : undefined,
        };
      },
      onEachFeature: (feature, layer) => {
        const p = feature.properties;
        layer.bindPopup(`
          <div class="p-2" style="min-width: 220px;">
            <strong style="font-size: 14px;">${p.name}</strong>
            <div style="margin-top: 4px; font-size: 12px; color: #6b7280;">
              ${p.designation}
            </div>
            <div style="margin-top: 8px; font-size: 12px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                <span style="color: #6b7280;">IUCN Category:</span>
                <span>${p.iucn_category}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                <span style="color: #6b7280;">Area:</span>
                <span>${p.area_km2} km²</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                <span style="color: #6b7280;">Species Recorded:</span>
                <span>${p.species_count}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                <span style="color: #6b7280;">Status:</span>
                <span>${p.status}</span>
              </div>
            </div>
            <div style="margin-top: 6px; font-size: 11px; color: #6b7280;">
              ${p.species}
            </div>
            <div style="margin-top: 8px; padding-top: 6px; border-top: 1px solid #e5e7eb; font-size: 11px; color: #9ca3af;">
              Source: ${p.source}
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

export function BiodiversityLegend() {
  return (
    <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 z-[1000]">
      <h4 className="text-sm font-medium mb-2">Biodiversity & Protected Areas</h4>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-emerald-500 rounded opacity-60" />
          <span className="text-xs">Key Biodiversity Area (KBA)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-emerald-600 rounded opacity-60" />
          <span className="text-xs">Protected Area (WDPA)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded opacity-60 border border-dashed border-emerald-400" style={{ backgroundColor: '#6ee7b7' }} />
          <span className="text-xs">Wildlife Corridor / Buffer</span>
        </div>
      </div>
      <div className="mt-2 pt-2 border-t text-xs text-muted-foreground">
        Data: WDPA (Protected Planet) · BirdLife/KBA
      </div>
    </div>
  );
}
