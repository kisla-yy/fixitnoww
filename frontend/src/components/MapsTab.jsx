import React, { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Fly to issue only if coordinates are valid
function FlyToIssue({ issue }) {
  const map = useMap();
  const popupRef = useRef(null);

  useEffect(() => {
    if (!issue || !issue.lat || !issue.lng) return;

    const lat = Number(issue.lat);
    const lng = Number(issue.lng);
    if (isNaN(lat) || isNaN(lng)) return;

    map.flyTo([lat, lng], 14, { animate: true });

    setTimeout(() => {
      if (popupRef.current) popupRef.current.openOn(map);
    }, 800);
  }, [issue, map]);

  if (!issue || !issue.lat || !issue.lng) return null;

  const lat = Number(issue.lat);
  const lng = Number(issue.lng);
  if (isNaN(lat) || isNaN(lng)) return null;

  return (
    <Marker key={issue._id} position={[lat, lng]}>
      <Popup ref={popupRef}>
        <strong>{issue.title}</strong>
        <br />
        {issue.description}
      </Popup>
    </Marker>
  );
}

export default function MapsTab({ issues, selectedIssue }) {
  // Only show markers with valid coordinates
  const validIssues = issues.filter(
    (i) =>
      i.lat != null &&
      i.lng != null &&
      !isNaN(Number(i.lat)) &&
      !isNaN(Number(i.lng))
  );

  return (
    <div className="w-full h-full">
      <MapContainer
        center={[20.5937, 78.9629]} // Default India
        zoom={5}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {validIssues.map((issue) => (
          <Marker key={issue._id} position={[Number(issue.lat), Number(issue.lng)]}>
            <Popup>
              <strong>{issue.title}</strong>
              <br />
              {issue.description}
            </Popup>
          </Marker>
        ))}

        {selectedIssue && (
          <FlyToIssue
            issue={
              selectedIssue.lat != null && selectedIssue.lng != null
                ? selectedIssue
                : null
            }
          />
        )}
      </MapContainer>
    </div>
  );
}
