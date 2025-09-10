import React, { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Helper: focus map on selected issue
function FlyToIssue({ issue }) {
  const map = useMap();
  const popupRef = useRef(null);

  useEffect(() => {
    if (issue) {
      // Fly to issue
      map.flyTo([issue.lat, issue.lng], 14, { animate: true });
      // Open popup after animation delay
      setTimeout(() => {
        if (popupRef.current) {
          popupRef.current.openOn(map);
        }
      }, 800);
    }
  }, [issue, map]);

  return (
    issue && (
      <Marker position={[issue.lat, issue.lng]}>
        <Popup ref={popupRef}>
          <strong>{issue.title}</strong>
          <br />
          {issue.description}
        </Popup>
      </Marker>
    )
  );
}

export default function MapsTab({ issues, selectedIssue }) {
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

        {/* Show all issues */}
        {issues.map((issue) => (
          <Marker key={issue.id} position={[issue.lat, issue.lng]}>
            <Popup>
              <strong>{issue.title}</strong>
              <br />
              {issue.description}
            </Popup>
          </Marker>
        ))}

        {/* If one issue is selected → focus on it */}
        {selectedIssue && <FlyToIssue issue={selectedIssue} />}
      </MapContainer>
    </div>
  );
}
