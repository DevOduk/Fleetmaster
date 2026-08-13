"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const icon = L.icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function LocationMarker({ position, setPosition }: { position: [number, number] | null; setPosition: (pos: [number, number]) => void }) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position ? <Marker position={position} icon={icon} /> : null;
}

export default function MapPicker({ center, setLocation }: { center: [number, number], setLocation: (pos: [number, number]) => void }) {
  const [isMounted, setIsMounted] = useState(false);

  // Prevents server-side rendering mismatch and handles fast-refresh DOM clearing
  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  if (!isMounted) {
    return <div className="h-full w-full bg-gray-100 animate-pulse rounded-2xl" />;
  }

  return (
    <MapContainer 
      key={`${center[0]}-${center[1]}`} // Forces clean remount if center changes or fast-refresh occurs
      center={center} 
      zoom={8} 
      className="h-full w-full z-0"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <LocationMarker position={center} setPosition={setLocation} />
    </MapContainer>
  );
}