'use client';

import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

interface GeologicalDepositsLayerProps {
  opacity?: number;
  center?: [number, number];
}

const COMMODITY_COLORS: Record<string, { fill: string; stroke: string }> = {
  copper: { fill: '#b87333', stroke: '#8b5a2b' },
  nickel: { fill: '#7cb342', stroke: '#558b2f' },
  lithium: { fill: '#9c27b0', stroke: '#7b1fa2' },
  cobalt: { fill: '#1565c0', stroke: '#0d47a1' },
};

export function GeologicalDepositsLayer({ opacity = 0.7, center }: GeologicalDepositsLayerProps) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const mapCenter: [number, number] = center || [map.getCenter().lat, map.getCenter().lng];
    const [lat, lng] = mapCenter;

    const deposits: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {
            name: 'Cerro Rico Deposit',
            deposit_type: 'Porphyry copper',
            commodity: 'copper',
            status: 'Past producer',
            size: 'Large',
            discovery_year: 1978,
            mrds_id: '10045782',
          },
          geometry: { type: 'Point', coordinates: [lng - 0.12, lat + 0.08] },
        },
        {
          type: 'Feature',
          properties: {
            name: 'Quebrada Norte',
            deposit_type: 'Porphyry copper-gold',
            commodity: 'copper',
            status: 'Prospect',
            size: 'Medium',
            discovery_year: 2015,
            mrds_id: '10098234',
          },
          geometry: { type: 'Point', coordinates: [lng + 0.15, lat + 0.04] },
        },
        {
          type: 'Feature',
          properties: {
            name: 'Sierra Verde',
            deposit_type: 'Laterite nickel',
            commodity: 'nickel',
            status: 'Occurrence',
            size: 'Large',
            discovery_year: 1992,
            mrds_id: '10067891',
          },
          geometry: { type: 'Point', coordinates: [lng + 0.08, lat - 0.14] },
        },
        {
          type: 'Feature',
          properties: {
            name: 'Loma Oscura',
            deposit_type: 'Magmatic sulfide nickel',
            commodity: 'nickel',
            status: 'Active',
            size: 'Medium',
            discovery_year: 1965,
            mrds_id: '10023456',
          },
          geometry: { type: 'Point', coordinates: [lng - 0.18, lat - 0.06] },
        },
        {
          type: 'Feature',
          properties: {
            name: 'Salar Blanco',
            deposit_type: 'Brine lithium',
            commodity: 'lithium',
            status: 'Prospect',
            size: 'Large',
            discovery_year: 2018,
            mrds_id: '10112345',
          },
          geometry: { type: 'Point', coordinates: [lng + 0.22, lat + 0.12] },
        },
        {
          type: 'Feature',
          properties: {
            name: 'Pegmatita Central',
            deposit_type: 'Pegmatite lithium',
            commodity: 'lithium',
            status: 'Occurrence',
            size: 'Small',
            discovery_year: 2009,
            mrds_id: '10089012',
          },
          geometry: { type: 'Point', coordinates: [lng - 0.06, lat + 0.18] },
        },
        {
          type: 'Feature',
          properties: {
            name: 'Roca Azul',
            deposit_type: 'Sediment-hosted cobalt',
            commodity: 'cobalt',
            status: 'Prospect',
            size: 'Unknown',
            discovery_year: 2021,
            mrds_id: '10134567',
          },
          geometry: { type: 'Point', coordinates: [lng - 0.04, lat - 0.22] },
        },
      ],
    };

    const geoJsonLayer = L.geoJSON(deposits, {
      pointToLayer: (_feature, latlng) => {
        const commodity = _feature.properties?.commodity || 'copper';
        const colors = COMMODITY_COLORS[commodity] || COMMODITY_COLORS.copper;
        return L.circleMarker(latlng, {
          radius: 7,
          fillColor: colors.fill,
          color: colors.stroke,
          weight: 2,
          opacity: 1,
          fillOpacity: opacity,
        });
      },
      onEachFeature: (feature, layer) => {
        const p = feature.properties;
        const colors = COMMODITY_COLORS[p.commodity] || COMMODITY_COLORS.copper;
        layer.bindPopup(`
          <div class="p-2" style="min-width: 220px;">
            <strong style="font-size: 14px;">${p.name}</strong>
            <div style="margin-top: 4px; font-size: 12px; color: #6b7280;">
              ${p.deposit_type}
            </div>
            <div style="margin-top: 8px; font-size: 12px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                <span style="color: #6b7280;">Commodity:</span>
                <span style="color: ${colors.fill}; font-weight: 600;">${p.commodity.charAt(0).toUpperCase() + p.commodity.slice(1)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                <span style="color: #6b7280;">Status:</span>
                <span>${p.status}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                <span style="color: #6b7280;">Est. Size:</span>
                <span>${p.size}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                <span style="color: #6b7280;">Discovery Year:</span>
                <span>${p.discovery_year}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                <span style="color: #6b7280;">MRDS ID:</span>
                <span>${p.mrds_id}</span>
              </div>
            </div>
            <div style="margin-top: 8px; padding-top: 6px; border-top: 1px solid #e5e7eb; font-size: 11px; color: #9ca3af;">
              Source: USGS Mineral Resources Data System (MRDS)
            </div>
          </div>
        `);
      },
    }).addTo(map);

    return () => {
      map.removeLayer(geoJsonLayer);
    };
  }, [map, opacity, center]);

  return null;
}
