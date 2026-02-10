'use client';

import { useState, useCallback, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { SampleMine } from '@/lib/dummy-data';
import { MousePointerClick } from 'lucide-react';
import { initLeafletIcons } from '@/lib/leaflet-setup';
import { MINERAL_HEX_COLORS } from '@/lib/constants';

initLeafletIcons();

// Create custom marker icons
const createSampleMineIcon = (mineralType: string) => {
  return new L.DivIcon({
    html: `
      <div class="flex items-center justify-center w-8 h-8 rounded-full shadow-lg border-2 border-white" style="background-color: ${MINERAL_HEX_COLORS[mineralType] || '#6b7280'}">
        <div class="w-3 h-3 bg-white rounded-full"></div>
      </div>
    `,
    className: 'custom-sample-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

const userLocationIcon = new L.DivIcon({
  html: `
    <div class="flex items-center justify-center w-10 h-10 bg-red-500 rounded-full shadow-lg border-3 border-white">
      <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
      </svg>
    </div>
  `,
  className: 'custom-user-marker',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

export interface LocationData {
  coordinates: { lat: number; lng: number };
  clickType: 'map' | 'sample' | 'manual';
  sampleMineId?: string;
}

interface MapLocationPickerProps {
  initialCoordinates?: { lat: number; lng: number };
  onLocationSelect: (location: LocationData) => void;
  sampleLocations: SampleMine[];
  showSampleMarkers?: boolean;
  flyTo?: { lat: number; lng: number; zoom?: number } | null;
}

// Helper component that flies to a location when the flyTo prop changes
function FlyToHandler({ flyTo }: { flyTo: { lat: number; lng: number; zoom?: number } | null }) {
  const map = useMap();
  useEffect(() => {
    if (flyTo) {
      map.flyTo([flyTo.lat, flyTo.lng], flyTo.zoom ?? 10, { duration: 1.5 });
    }
  }, [flyTo, map]);
  return null;
}

// Component to handle map click events
function MapClickHandler({ onClick, onInteraction }: { onClick: (lat: number, lng: number) => void; onInteraction: () => void }) {
  useMapEvents({
    click: (e) => {
      onClick(e.latlng.lat, e.latlng.lng);
      onInteraction();
    },
    dragstart: () => onInteraction(),
    zoomstart: () => onInteraction(),
  });
  return null;
}

export function MapLocationPicker({
  initialCoordinates,
  onLocationSelect,
  sampleLocations,
  showSampleMarkers = true,
  flyTo = null,
}: MapLocationPickerProps) {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(
    initialCoordinates || null
  );
  const [mapCenter] = useState<[number, number]>([20, 0]); // World view
  const [mapZoom] = useState(2);
  const [showHint, setShowHint] = useState(true);

  // Hide hint after 5 seconds or on interaction
  useEffect(() => {
    const timer = setTimeout(() => setShowHint(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleInteraction = useCallback(() => {
    setShowHint(false);
  }, []);

  const handleMapClick = useCallback(
    (lat: number, lng: number) => {
      const location = { lat, lng };
      setUserLocation(location);
      onLocationSelect({
        coordinates: location,
        clickType: 'map',
      });
    },
    [onLocationSelect]
  );

  const handleSampleClick = useCallback(
    (sample: SampleMine) => {
      setUserLocation(null); // Clear user location when selecting sample
      onLocationSelect({
        coordinates: sample.coordinates,
        clickType: 'sample',
        sampleMineId: sample.id,
      });
    },
    [onLocationSelect]
  );

  return (
    <div className="relative h-full w-full">
      {/* "Click to place marker" Overlay Hint */}
      {showHint && (
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[1000] pointer-events-none animate-fade-in"
        >
          <div className="bg-black/80 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2">
            <MousePointerClick className="w-5 h-5" />
            <span className="text-sm font-medium">Click anywhere to place a marker</span>
          </div>
        </div>
      )}

      {/* Legend - Corner Overlay */}
      <div className="absolute bottom-4 right-4 z-[1000] bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3 text-xs">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span>Lithium</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span>Copper</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Nickel</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <span>Cobalt</span>
          </div>
          {userLocation && (
            <div className="flex items-center gap-2 pt-1 border-t">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Your Location</span>
            </div>
          )}
        </div>
      </div>

      {/* Map Container - Full height with crosshair cursor */}
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        className="h-full w-full"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapClickHandler onClick={handleMapClick} onInteraction={handleInteraction} />
        <FlyToHandler flyTo={flyTo} />

        {/* Sample Mine Markers */}
        {showSampleMarkers &&
          sampleLocations.map((sample) => (
            <Marker
              key={sample.id}
              position={[sample.coordinates.lat, sample.coordinates.lng]}
              icon={createSampleMineIcon(sample.mineralType)}
              eventHandlers={{
                click: () => handleSampleClick(sample),
              }}
            >
              <Popup>
                <div className="text-sm">
                  <p className="font-semibold">{sample.name}</p>
                  <p className="text-xs text-muted-foreground">{sample.location}</p>
                  <p className="text-xs mt-1">
                    {sample.mineralType.charAt(0).toUpperCase() + sample.mineralType.slice(1)} mining
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}

        {/* User-Placed Location Marker */}
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={userLocationIcon}>
            <Popup>
              <div className="text-sm">
                <p className="font-semibold">Your Location</p>
                <p className="text-xs">
                  {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                </p>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
