// src/components/MapModal.jsx
import React, { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// ✅ Demo marker icon (fixes missing marker issue in Leaflet)
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

        <div className="h-full w-full">
          <MapContainer
            center={[location.lat, location.lng]}
            zoom={15}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
            />
            <Marker position={[location.lat, location.lng]} icon={markerIcon}>
              <Popup>{title}</Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
