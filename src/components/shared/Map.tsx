import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom Truck Icon
const truckIcon = L.divIcon({
  className: 'custom-truck-icon',
  html: `<div style="background-color: #228B22; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 17h4V5H2v12h3"/><path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5"/><path d="M14 17h1"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>
  </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16]
});

const ROUTE_POINTS: [number, number][] = [
  [6.8533, 80.0575], // Meepe
  [6.8520, 80.0500], // Meegoda
  [6.8480, 80.0300], // Godagama
  [6.8430, 80.0000], // Homagama
  [6.8410, 79.9900], // Makumbura
  [6.8412, 79.9700]  // Kottawa
];

// ... imports ...

export function Map({
  className,
  truckPosition
}: {
  className?: string;
  truckPosition?: [number, number];
}) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const truckMarkerRef = useRef<L.Marker | null>(null);
  const routePolylineRef = useRef<L.Polyline | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;
    if (mapInstance.current) return; // Initialize once

    // Initialize Map - Center on Homagama area
    const map = L.map(mapContainer.current).setView([6.8480, 80.0300], 13);
    mapInstance.current = map;

    // Add Tile Layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Route Polyline (Static for demo)
    routePolylineRef.current = L.polyline(ROUTE_POINTS, {
      color: '#228B22',
      weight: 4,
      opacity: 0.6,
      dashArray: '10, 10'
    }).addTo(map);

    // User Location Circle - Meepe
    L.circleMarker([6.8533, 80.0575], {
      radius: 8,
      color: '#ffffff',
      fillColor: '#3b82f6',
      fillOpacity: 1,
      weight: 2
    }).addTo(map).bindPopup("Your Location");

    // Create Marker instance (but don't add yet if no position)
    truckMarkerRef.current = L.marker([0, 0], { icon: truckIcon }); // Init with dummy pos

    setTimeout(() => {
      map.invalidateSize();
    }, 100);

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  // Sync Marker with Props
  useEffect(() => {
    if (!mapInstance.current || !truckMarkerRef.current) return;

    if (truckPosition) {
      // Update position
      truckMarkerRef.current.setLatLng(truckPosition);

      // Ensure it is on the map
      if (!mapInstance.current.hasLayer(truckMarkerRef.current)) {
        truckMarkerRef.current.addTo(mapInstance.current);
        truckMarkerRef.current.bindPopup(`
          <div class="p-1">
             <strong class="block text-sm">Collection Truck</strong>
             <span class="text-xs text-neutral-500">Live Tracking</span>
          </div>
       `);
      }

      // Optional: Pan map to follow truck (gentle)
      mapInstance.current.panTo(truckPosition, { animate: true, duration: 1 });

    } else {
      // Remove if no position
      if (mapInstance.current.hasLayer(truckMarkerRef.current)) {
        truckMarkerRef.current.remove();
      }
    }
  }, [truckPosition]);

  return (
    <div
      ref={mapContainer}
      className={`relative w-full h-full bg-neutral-100 rounded-lg overflow-hidden border border-neutral-200 z-0 ${className}`}
      style={{ minHeight: '500px', height: '100%' }}
    />
  );
}