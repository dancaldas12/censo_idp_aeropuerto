'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet marker icons in Next.js
const customIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface LocationMarkerProps {
  position: [number, number];
  onDragEnd: (lat: number, lng: number) => void;
  onMapClick: (lat: number, lng: number) => void;
}

function LocationMarker({ position, onDragEnd, onMapClick }: LocationMarkerProps) {
  const map = useMap();

  useEffect(() => {
    map.flyTo(position, 16, { duration: 1.5 });
  }, [position, map]);

  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });

  return (
    <Marker
      position={position}
      draggable={true}
      icon={customIcon}
      eventHandlers={{
        dragend(e) {
          const marker = e.target;
          if (marker != null) {
            const latLng = marker.getLatLng();
            onDragEnd(latLng.lat, latLng.lng);
          }
        },
      }}
    />
  );
}

interface InteractiveMapProps {
  lat: number;
  lng: number;
  onLocationChange: (lat: number, lng: number) => void;
}

export default function InteractiveMap({ lat, lng, onLocationChange }: InteractiveMapProps) {
  const position: [number, number] = [lat, lng];

  return (
    <div className="relative w-full h-[250px] sm:h-[320px] md:h-[360px] rounded-2xl overflow-hidden border border-slate-700/70 shadow-inner">
      <MapContainer
        center={position}
        zoom={15}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker
          position={position}
          onDragEnd={onLocationChange}
          onMapClick={onLocationChange}
        />
      </MapContainer>

      <div className="absolute bottom-2.5 left-2.5 right-2.5 sm:right-auto z-[1000] bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/80 text-[11px] text-slate-300 font-mono shadow-lg flex items-center justify-between sm:justify-start gap-2 max-w-full truncate">
        <span className="truncate">📍 {lat.toFixed(5)}, {lng.toFixed(5)}</span>
        <span className="text-[10px] text-amber-400 font-sans hidden xxs:inline sm:inline shrink-0">
          (Arrastra el marcador)
        </span>
      </div>
    </div>
  );
}
