// src/components/TestMap.jsx
import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix marker icon URLs
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

export default function TestMap() {
  console.log("TestMap component rendering");
  
  return (
    <div style={{ height: 400, width: "100%", border: "2px solid red", margin: "20px" }}>
      <h2>Test Map</h2>
      <MapContainer
        center={[28.6139, 77.209]}
        zoom={13}
        style={{ height: "350px", width: "100%" }}
        whenCreated={(map) => console.log("Map created successfully:", map)}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />
        <Marker position={[28.6139, 77.209]}>
          <Popup>Test marker - Delhi</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
