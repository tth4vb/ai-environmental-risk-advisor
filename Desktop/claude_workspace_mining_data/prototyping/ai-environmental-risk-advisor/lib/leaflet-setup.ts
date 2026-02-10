import L from 'leaflet';

/**
 * Fix Leaflet default icon paths that break under Next.js / Webpack.
 * Must only run on the client (guard with `typeof window`).
 */
export function initLeafletIcons() {
  if (typeof window === 'undefined') return;

  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  });
}
