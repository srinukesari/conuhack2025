import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icon not showing
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const getIcon = (severity) => {
  let iconUrl;
  switch (severity) {
    case "low":
      iconUrl =
        "data:image/svg+xml;base64," +
        btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
          <path fill="#00FF00" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/>
        </svg>
      `);
      break;
    case "medium":
      iconUrl =
        "data:image/svg+xml;base64," +
        btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
          <path fill="#FFA500" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/>
        </svg>
      `);
      break;
    case "high":
      iconUrl =
        "data:image/svg+xml;base64," +
        btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
          <path fill="#FF0000" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/>
        </svg>
      `);
      break;
    default:
      iconUrl = "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png";
  }
  return new L.Icon({
    iconUrl,
    iconSize: [25, 41], // Adjust size as needed
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
};

const FitBounds = ({ coordinates }) => {
  const map = useMap();

  useEffect(() => {
    if (coordinates.length > 0) {
      const bounds = L.latLngBounds(
        coordinates.map((coord) => [coord[0], coord[1]])
      );
      map.fitBounds(bounds);
    }
  }, [coordinates, map]);

  return null;
};

const MapWidget = ({ coordinates }) => {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <h3>Fire Severity Addressed Locations</h3>
      <MapContainer
        center={[51.505, -0.09]}
        zoom={2}
        style={{ width: "100%", height: "calc(100% - 60px)" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {coordinates.map((coord, index) => (
          <Marker
            key={index}
            position={[coord[0], coord[1]]}
            icon={getIcon(coord[2])}>
            <Popup>
              Latitude: {coord[0]}, Longitude: {coord[1]}
            </Popup>
          </Marker>
        ))}
        <FitBounds coordinates={coordinates} />
      </MapContainer>
    </div>
  );
};

export default MapWidget;
