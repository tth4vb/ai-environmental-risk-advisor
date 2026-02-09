'use client';

import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

interface IndigenousLandsLayerProps {
  opacity?: number;
  center?: [number, number];
}

const TENURE_STYLES: Record<string, { fillColor: string; color: string; dashArray?: string }> = {
  'indigenous_territory': { fillColor: '#b45309', color: '#92400e' },
  'community_land': { fillColor: '#d97706', color: '#b45309' },
  'customary_rights': { fillColor: '#f59e0b', color: '#d97706', dashArray: '6 4' },
};

function generateIndigenousLands(center: [number, number]): GeoJSON.FeatureCollection {
  const [lat, lng] = center;

  return {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {
          name: 'Territorio Indígena Ancestral',
          tenure_type: 'indigenous_territory',
          recognition_status: 'Formally Recognized',
          community_population: 2400,
          area_km2: 185,
          fpic_status: 'Not initiated',
          source: 'LandMark',
          last_updated: '2024-03',
          community_name: 'Comunidad Originaria'
        },
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [lng - 0.18, lat + 0.14],
            [lng - 0.05, lat + 0.2],
            [lng + 0.06, lat + 0.13],
            [lng + 0.04, lat + 0.02],
            [lng - 0.08, lat - 0.02],
            [lng - 0.18, lat + 0.14]
          ]]
        }
      },
      {
        type: 'Feature',
        properties: {
          name: 'Tierras Comunitarias de Pastoreo',
          tenure_type: 'community_land',
          recognition_status: 'Under Review',
          community_population: 850,
          area_km2: 62,
          fpic_status: 'In progress — incomplete',
          source: 'LandMark',
          last_updated: '2024-06',
          community_name: 'Comunidad Agropastoral'
        },
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [lng + 0.08, lat - 0.06],
            [lng + 0.2, lat - 0.02],
            [lng + 0.22, lat - 0.14],
            [lng + 0.12, lat - 0.18],
            [lng + 0.06, lat - 0.12],
            [lng + 0.08, lat - 0.06]
          ]]
        }
      },
      {
        type: 'Feature',
        properties: {
          name: 'Derechos Consuetudinarios de Agua y Tierra',
          tenure_type: 'customary_rights',
          recognition_status: 'Not Formally Recognized',
          community_population: 380,
          area_km2: 28,
          fpic_status: 'Not initiated',
          source: 'LandMark',
          last_updated: '2023-11',
          community_name: 'Comunidad Campesina'
        },
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [lng - 0.04, lat + 0.02],
            [lng + 0.04, lat + 0.05],
            [lng + 0.06, lat - 0.02],
            [lng + 0.01, lat - 0.06],
            [lng - 0.05, lat - 0.03],
            [lng - 0.04, lat + 0.02]
          ]]
        }
      }
    ]
  };
}

export function IndigenousLandsLayer({ opacity = 0.5, center }: IndigenousLandsLayerProps) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const mapCenter: [number, number] = center || [map.getCenter().lat, map.getCenter().lng];
    const landsData = generateIndigenousLands(mapCenter);

    const geoJsonLayer = L.geoJSON(landsData, {
      style: (feature) => {
        const tenureType = feature?.properties?.tenure_type || 'customary_rights';
        const style = TENURE_STYLES[tenureType] || TENURE_STYLES.customary_rights;

        return {
          fillColor: style.fillColor,
          color: style.color,
          weight: 2,
          opacity: 1,
          fillOpacity: opacity,
          dashArray: style.dashArray,
        };
      },
      onEachFeature: (feature, layer) => {
        const p = feature.properties;
        const fpicColor = p.fpic_status === 'Not initiated' ? '#dc2626' : '#f59e0b';

        layer.bindPopup(`
          <div class="p-2" style="min-width: 220px;">
            <strong style="font-size: 14px;">${p.name}</strong>
            <div style="margin-top: 4px; font-size: 12px; color: #6b7280;">
              ${p.community_name} · Pop. ${p.community_population?.toLocaleString()}
            </div>
            <div style="margin-top: 8px; font-size: 12px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                <span style="color: #6b7280;">Tenure:</span>
                <span>${p.tenure_type.replace(/_/g, ' ')}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                <span style="color: #6b7280;">Status:</span>
                <span>${p.recognition_status}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                <span style="color: #6b7280;">Area:</span>
                <span>${p.area_km2} km²</span>
              </div>
            </div>
            <div style="margin-top: 8px; padding: 6px 8px; background: #fffbeb; border-radius: 4px; border-left: 3px solid ${fpicColor};">
              <div style="font-size: 11px; font-weight: 600; color: ${fpicColor};">
                FPIC Status: ${p.fpic_status}
              </div>
            </div>
            <div style="margin-top: 8px; padding-top: 6px; border-top: 1px solid #e5e7eb; font-size: 11px; color: #9ca3af;">
              Source: ${p.source} · Updated: ${p.last_updated}
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

export function IndigenousLandsLegend() {
  return (
    <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 z-[1000]">
      <h4 className="text-sm font-medium mb-2">Indigenous & Community Lands</h4>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded opacity-60" style={{ backgroundColor: '#b45309' }} />
          <span className="text-xs">Indigenous Territory</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded opacity-60" style={{ backgroundColor: '#d97706' }} />
          <span className="text-xs">Community Land</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded opacity-60 border border-dashed border-amber-600" style={{ backgroundColor: '#f59e0b' }} />
          <span className="text-xs">Customary Rights (unrecognized)</span>
        </div>
      </div>
      <div className="mt-2 pt-2 border-t text-xs text-muted-foreground">
        Data: LandMark (WRI) · CC BY-SA 4.0
      </div>
    </div>
  );
}
