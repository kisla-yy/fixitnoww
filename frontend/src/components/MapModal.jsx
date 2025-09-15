import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Component to invalidate map size after modal opens
const MapInvalidator = () => {
  const map = useMap();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 150);
    
    return () => clearTimeout(timer);
  }, [map]);

  return null;
};

// Demo marker icon (fixes missing marker issue in Leaflet)
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});

export default function MapModal({ isOpen, onClose, location = { lat: 28.6139, lng: 77.209 }, title = "Issue Location" }) {
  const overlayRef = useRef(null);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Delay map rendering to ensure modal is fully displayed
      const timer = setTimeout(() => {
        setShowMap(true);
      }, 200);
      return () => clearTimeout(timer);
    } else {
      setShowMap(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  function onOverlayClick(e) {
    if (e.target === overlayRef.current) {
      onClose();
    }
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      onClick={onOverlayClick}
    >
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative w-full sm:max-w-4xl mx-4 sm:mx-auto bg-white rounded-t-lg sm:rounded-lg shadow-lg overflow-hidden z-10 h-3/4 sm:h-[500px]">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-md hover:bg-gray-100"
          >
            Close
          </button>
        </div>

        <div style={{ height: "calc(100% - 80px)", width: "100%" }}>
          {showMap ? (
            <MapContainer
              center={[location.lat, location.lng]}
              zoom={15}
              style={{ height: "100%", width: "100%" }}
            >
              <MapInvalidator />
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
              />
              <Marker position={[location.lat, location.lng]} icon={markerIcon}>
                <Popup>{title}</Popup>
              </Marker>
            </MapContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-500">Loading map...</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
