import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

function ChangeView({ center, zoom }) {
  const map = useMap();
  if (center && typeof center[0] === 'number' && typeof center[1] === 'number') {
    map.flyTo(center, zoom);
  }
  return null;
}

const calculateMarkerRadius = (mw) => {
  if (!mw || typeof mw !== 'number' || mw <= 0) {
    return 6; 
  }
  return 6 + Math.log(mw) * 2;
};

function LeafletMap({ incidents, selectedIncident, onMarkerClick }) {
  const [activeIncident, setActiveIncident] = useState(null);
  const defaultPosition = [30, 0];

  // --- NEW DEBUGGING LOG ---
  // Let's inspect the very first incident when the data arrives
  if (incidents.length > 0) {
    console.log("Inspecting first incident for map:", incidents[0]);
    console.log("Type of latitude:", typeof incidents[0].latitude);
    console.log("Type of longitude:", typeof incidents[0].longitude);
  }

  return (
    <MapContainer center={defaultPosition} zoom={2} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {selectedIncident && (
        <ChangeView center={[selectedIncident.latitude, selectedIncident.longitude]} zoom={6} />
      )}

      {incidents.map(incident => {
        // This defensive check is still important
        if (typeof incident.latitude !== 'number' || typeof incident.longitude !== 'number') {
          return null;
        }

        const icon = L.divIcon({
          html: `<svg viewBox="0 0 24 24" width="${calculateMarkerRadius(incident.capacity_mw) * 2}" height="${calculateMarkerRadius(incident.capacity_mw) * 2}"><circle cx="12" cy="12" r="10" fill="${selectedIncident?.id === incident.id ? '#ff0000' : '#007bff'}" fill-opacity="0.8" stroke="white" stroke-width="2"/></svg>`,
          className: '',
          iconSize: [calculateMarkerRadius(incident.capacity_mw) * 2, calculateMarkerRadius(incident.capacity_mw) * 2],
        });

        return (
          <Marker 
            key={incident.id} 
            position={[incident.latitude, incident.longitude]}
            icon={icon}
            eventHandlers={{
              mouseover: () => setActiveIncident(incident),
              mouseout: () => setActiveIncident(null),
              click: () => onMarkerClick(incident),
            }}
          >
            {activeIncident?.id === incident.id && (
              <Popup>
                <b>{incident.location}</b><br />
                {incident.capacity_mw && `${incident.capacity_mw} MW`}
              </Popup>
            )}
          </Marker>
        );
      })}
    </MapContainer>
  );
}

export default LeafletMap;