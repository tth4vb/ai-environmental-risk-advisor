'use client';

import { useEffect, useState } from 'react';
import { Mine } from '@/types';
import { getNewAlertCount } from '@/lib/mock-alerts';
import { isCertified, getCertificationBadge } from '@/lib/standards-utils';

interface MineMapProps {
  mines: Mine[];
  selectedMineId?: string;
  onMineSelect: (mine: Mine) => void;
}

const certificationColors = {
  certified: '#22c55e',        // Green - has valid certification
  in_progress: '#3b82f6',      // Blue - verification in progress
  disclosure: '#f59e0b',       // Amber - some transparency
  not_certified: '#9ca3af'     // Gray - no certification
};

// Helper function to determine certification-based color
const getCertificationColor = (mine: Mine): string => {
  if (isCertified(mine)) return certificationColors.certified;
  if (mine.progressLevel === 'verification') return certificationColors.in_progress;
  if (mine.progressLevel && ['disclosure', 'self_assessment'].includes(mine.progressLevel)) {
    return certificationColors.disclosure;
  }
  return certificationColors.not_certified;
};

export function MineMap({ mines, selectedMineId, onMineSelect }: MineMapProps) {
  const [mounted, setMounted] = useState(false);
  const [MapComponent, setMapComponent] = useState<React.ComponentType<any> | null>(null);

  useEffect(() => {
    setMounted(true);

    // Dynamically import Leaflet components
    Promise.all([
      import('react-leaflet'),
      import('leaflet'),
      import('react')
    ]).then(([reactLeaflet, L, React]) => {
      // Fix default marker icons
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });

      const { MapContainer, TileLayer, CircleMarker, Popup, useMap } = reactLeaflet;

      // Component to fit map bounds to all mines
      const FitBoundsComponent = ({ mines }: { mines: Mine[] }) => {
        const map = useMap();

        React.useEffect(() => {
          if (mines.length > 0) {
            // Calculate bounds from all mine coordinates
            const bounds = mines.map(mine => [mine.latitude, mine.longitude] as [number, number]);
            map.fitBounds(bounds as any, { padding: [50, 50] });
          }
        }, [mines, map]);

        return null;
      };

      // Create the map component
      const LeafletMap = ({ mines, selectedMineId, onMineSelect }: MineMapProps) => {
        return (
          <MapContainer
            center={[0, 0]}
            zoom={2}
            minZoom={2}
            maxZoom={18}
            maxBounds={[[-85, -Infinity], [85, Infinity]]}
            maxBoundsViscosity={0.8}
            style={{ height: '100%', width: '100%' }}
            className="z-0"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <FitBoundsComponent mines={mines} />
            {mines.map((mine) => {
              const alertCount = getNewAlertCount(mine.id);
              const isSelected = mine.id === selectedMineId;
              const certified = isCertified(mine);
              const certBadge = getCertificationBadge(mine);

              return (
                <CircleMarker
                  key={mine.id}
                  center={[mine.latitude, mine.longitude]}
                  radius={isSelected ? 7 : 5}
                  pathOptions={{
                    fillColor: getCertificationColor(mine),
                    color: isSelected ? '#000' : getCertificationColor(mine),
                    weight: isSelected ? 2 : 0.5,
                    opacity: isSelected ? 1 : 0.8,
                    fillOpacity: 1,
                    // Add dashed border for non-certified mines (only when selected)
                    dashArray: (!certified && isSelected) ? '3, 3' : undefined
                  }}
                  eventHandlers={{
                    click: () => onMineSelect(mine)
                  }}
                >
                  <Popup>
                    <div className="p-1">
                      <div className="font-semibold">{mine.name}</div>
                      <div className="text-sm text-gray-600">{mine.company}</div>
                      <div className="text-sm mt-1">
                        <span className="capitalize">{mine.commodity}</span> • {mine.country}
                      </div>

                      {/* Certification status */}
                      {certified ? (
                        <div className="text-xs text-green-600 mt-1 font-medium flex items-center gap-1">
                          <span>{certBadge}</span>
                          <span>Certified</span>
                        </div>
                      ) : (
                        <div className="text-xs text-gray-500 mt-1">
                          Not certified
                        </div>
                      )}

                      {/* Alerts */}
                      {alertCount > 0 && (
                        <div className="text-sm text-red-600 mt-1">
                          {alertCount} active alert{alertCount > 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })}

            {/* Map Legend */}
            <div className="leaflet-bottom leaflet-left" style={{ pointerEvents: 'auto' }}>
              <div className="bg-white p-3 rounded shadow-lg text-xs space-y-3 ml-2 mb-2">
                <div>
                  <div className="font-semibold mb-2">Certification Status</div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-green-500"></div>
                      <span>Certified</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                      <span>Verification in Progress</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-amber-500"></div>
                      <span>Some Transparency</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-gray-400"></div>
                      <span>Not Certified</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t text-xs text-gray-500">
                  <span>Solid: Certified • Dashed: Not Certified</span>
                </div>
              </div>
            </div>
          </MapContainer>
        );
      };

      setMapComponent(() => LeafletMap);
    });
  }, []);

  if (!mounted || !MapComponent) {
    return (
      <div className="h-full w-full bg-muted flex items-center justify-center">
        <div className="text-muted-foreground">Loading map...</div>
      </div>
    );
  }

  return <MapComponent mines={mines} selectedMineId={selectedMineId} onMineSelect={onMineSelect} />;
}
