"use client";
import React from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapMultiProps {
  center: [number, number];
  zoom?: number;
  yardsData?: any[];
  isDarkMode?: boolean;
  className?: string;
}

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

export default function MapMulti({
  center,
  zoom = 6,
  yardsData = [],
  isDarkMode = false,
  className,
}: MapMultiProps) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className={className || "h-full rounded-2xl"}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {yardsData?.map((yard: any, i: number) => {
        if (!yard?.location || yard.location.length < 2) return null;
        return (
          <Marker
            key={i}
            position={[yard.location[0], yard.location[1]]}
            icon={defaultIcon}
          >
            <Popup>
              <div className="flex items-center gap-3">
                <img
                  src={yard.image_url || yard.imageUrl}
                  alt={yard.title || "Yard"}
                  className="mb-2 h-auto w-20 rounded"
                />
                <div>
                  <strong>{yard.title}</strong>
                  {yard.description && (
                    <div>
                      <br />
                      <span className="mt-1 text-sm/4 text-gray-400">
                        {yard.description}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
