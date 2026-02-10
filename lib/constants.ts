/** Country → approximate [lat, lng] for map centering when no coordinates are provided. */
export const DEFAULT_COORDS: Record<string, [number, number]> = {
  'Argentina': [-27.5, -67.5],
  'Democratic Republic of Congo': [-10.7, 25.5],
  'Indonesia': [-2.5, 121.9],
  'Chile': [-24.5, -69.25],
  'Peru': [-12.0, -77.0],
};

/** Tailwind class strings per mineral type (used for badge / icon backgrounds). */
export const MINERAL_COLORS: Record<string, string> = {
  lithium: 'bg-blue-100 text-blue-800 border-blue-300',
  copper: 'bg-orange-100 text-orange-800 border-orange-300',
  nickel: 'bg-green-100 text-green-800 border-green-300',
  cobalt: 'bg-purple-100 text-purple-800 border-purple-300',
};

/** Hex colors per mineral type (used for map marker fills). */
export const MINERAL_HEX_COLORS: Record<string, string> = {
  lithium: '#3b82f6',
  copper: '#f97316',
  nickel: '#10b981',
  cobalt: '#a855f7',
};
