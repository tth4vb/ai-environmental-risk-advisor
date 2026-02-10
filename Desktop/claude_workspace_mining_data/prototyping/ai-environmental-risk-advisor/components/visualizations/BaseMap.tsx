'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Circle, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { initLeafletIcons } from '@/lib/leaflet-setup';

initLeafletIcons();

interface BaseMapProps {
  center: [number, number];
  zoom?: number;
  children?: React.ReactNode;
  className?: string;
}

// Component to handle map centering after load
function MapController({ center }: { center: [number, number] }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  
  return null;
}

export function BaseMap({ center, zoom = 10, children, className = "h-96" }: BaseMapProps) {
  return (
    <div className={`relative ${className} rounded-lg overflow-hidden`}>
      <MapContainer
        center={center}
        zoom={zoom}
        className="h-full w-full"
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapController center={center} />
        {children}
      </MapContainer>
    </div>
  );
}

interface RiskOverlayProps {
  center: [number, number];
  radiusKm: number;
  color: string;
  fillOpacity?: number;
  label?: string;
}

export function RiskOverlay({ center, radiusKm, color, fillOpacity = 0.2, label }: RiskOverlayProps) {
  return (
    <Circle
      center={center}
      radius={radiusKm * 1000} // Convert km to meters
      pathOptions={{
        color: color,
        fillColor: color,
        fillOpacity: fillOpacity,
        weight: 2,
      }}
    >
      {label && <Popup>{label}</Popup>}
    </Circle>
  );
}

interface MineMarkerProps {
  position: [number, number];
  label?: string;
}

export function MineMarker({ position, label = "Mining Site" }: MineMarkerProps) {
  const mineIcon = new L.DivIcon({
    html: `
      <div class="flex items-center justify-center w-12 h-12 bg-gray-800 rounded-lg shadow-lg border-2 border-white">
        <span class="text-white text-xs font-bold">MINE</span>
      </div>
    `,
    className: 'custom-mine-marker',
    iconSize: [48, 48],
    iconAnchor: [24, 24],
  });

  return (
    <Marker position={position} icon={mineIcon}>
      <Popup>{label}</Popup>
    </Marker>
  );
}