"use client";
import React from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapClientProps {
  location: [number, number];
  image_url?: string;
  title?: string;
  description?: string;
  zoom?: number;
  className?: string;
}

// Fix for default marker icon
const defaultIcon = L.icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function MapClient({
  location,
  image_url,
  title,
  description,
  zoom = 9,
  className,
}: MapClientProps) {
  if (!location) return null;

  return (
    <MapContainer
      center={[location[0], location[1]]}
      zoom={zoom}
      className={className || "h-full rounded-2xl"}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[location[0], location[1]]} icon={defaultIcon}>
        <Popup>
          <div className="flex items-center gap-3">
            {image_url && (
              <img
                src={image_url}
                className="mb-2 h-20 w-20 rounded-lg border object-cover object-center"
              />
            )}
            <div>
              <strong>{title}</strong>
              {description && (
                <div className="mt-2 text-sm/4 text-gray-400">
                  {description}
                </div>
              )}
            </div>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
}
