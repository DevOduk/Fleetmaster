"use client";
import React, { useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icon
const defaultIcon = L.icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
// Fix for default marker icon
const vehicleIcon = L.icon({
  iconUrl: "https://cdn.iconscout.com/icon/premium/png-256-thumb/car-top-view-icon-svg-download-png-6071962.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [41, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const Map: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  // Check for dark mode after component mounts
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    };

    checkDarkMode();

    // Apply dark mode styles to leaflet
    const handleModeChange = () => {
      checkDarkMode();
      const tiles = document.querySelectorAll(".leaflet-tile");
      tiles.forEach((tile) => {
        const img = tile as HTMLImageElement;
        if (isDarkMode) {
          img.style.filter = "invert(0.93) hue-rotate(180deg) saturate(0.9)";
        } else {
          img.style.filter = "none";
        }
      });
    };

    const observer = new MutationObserver(handleModeChange);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    handleModeChange();
    return () => observer.disconnect();
  }, [isDarkMode]);

  return (
    <div
      className={`w-full rounded-2xl border transition-colors duration-200 h-100 ${isDarkMode
          ? "border-gray-800 bg-white/3"
          : "border-gray-200 bg-white"
        }`}
      style={{ height: '80vh' }}
    >
      <MapContainer
        center={[-1.286389, 36.817223]}
        zoom={7}
        className="h-full rounded-2xl"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={[-1.286389, 36.817223]} icon={defaultIcon}>
          <Popup>
            <div className="flex gap-3 items-center">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Kenyatta_International_Convention_Centre_02.jpg/1920px-Kenyatta_International_Convention_Centre_02.jpg" alt="Nairobi, Kenya" className="w-20 h-auto mb-2" />
              <div>
                <strong>Kisumu Yard, Kenya.</strong> <br /> <span className="mt-1 text-sm/4 text-gray-400">This is the location of our yard in Kisumu.
                </span>

              </div>
            </div>
          </Popup>
        </Marker>

        <Marker position={[-1.286389, 37.817223]} icon={vehicleIcon}>
          <Popup>
            <div className="flex gap-3 items-center">
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0eOCJnkg2QkNR1waxpMW5obhuPNI5dHYcAA&s" alt="Nairobi, Kenya" className="w-20 h-auto mb-2" />
              <div>
                <strong>Nissab Note, KDW 102A.</strong> <br /> <span className="mt-1 text-sm/4 text-gray-400">VIN: ABC123 | Status: En Route | Speed: 60 km/h | Last Updated: 10 mins ago
                </span>

              </div>
            </div>
          </Popup>
        </Marker>

        <Marker position={[0.5167, 35.7500]} icon={vehicleIcon}>
          <Popup>
            <div className="flex gap-3 items-center">
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4ZuUw0F519jRqP8Aw_GerVS9fLIiD7t1TIg&s" alt="Toyota Prado TX" className="w-20 h-auto mb-2" />
              <div>
                <strong>Toyota Prado TX, KDC 102A.</strong> <br /> <span className="mt-1 text-sm/4 text-gray-400">Vehicle: Toyota Prado TX | Location: Baringo | Status: Active | Last updated: 5 mins ago
                </span>

              </div>
            </div>
          </Popup>
        </Marker>

        <Marker position={[-0.091702, 34.767956]} icon={defaultIcon}>
          <Popup>
            <div className="flex gap-3 items-center">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Kenyatta_International_Convention_Centre_02.jpg/1920px-Kenyatta_International_Convention_Centre_02.jpg" alt="Nairobi, Kenya" className="w-20 h-auto mb-2" />
              <div>
                <strong>Nairobi Yard, Kenya.</strong> <br /> <span className="mt-1 text-sm/4 text-gray-400">This is the location of our main yard in Nairobi.
                </span>

              </div>
            </div>
          </Popup>
        </Marker>

        <Marker position={[-4.043740, 39.658871]} icon={defaultIcon}>
          <Popup>
            <div className="flex gap-3 items-center">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Kenyatta_International_Convention_Centre_02.jpg/1920px-Kenyatta_International_Convention_Centre_02.jpg" alt="Nairobi, Kenya" className="w-20 h-auto mb-2" />
              <div>
                <strong>Mombasa Yard, Kenya.</strong> <br /> <span className="mt-1 text-sm/4 text-gray-400">This is the location of our yard in Mombasa.
                </span>

              </div>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default Map;
