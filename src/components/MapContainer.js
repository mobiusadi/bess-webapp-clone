import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// This component now uses map.flyTo() for a smooth animation
function ChangeView({ center, zoom }) {
  const map = useMap();
  map.flyTo(center, zoom); // CHANGED: from setView to flyTo
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

  return (
    <MapContainer center={defaultPosition} zoom={2} style={{ height: '100%', width: '100%' }}>
      {/* CHANGED: Swapped the TileLayer URL to the CARTO "Positron" theme */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />

      {selectedIncident && (
        <ChangeView center={[selectedIncident.latitude, selectedIncident.longitude]} zoom={6} />
      )}

      {incidents.map(incident => {
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