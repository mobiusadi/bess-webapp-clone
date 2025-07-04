import React, { useState } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindow } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%'
};
const center = { lat: 30, lng: 0 };

const calculateMarkerScale = (mw) => {
  if (!mw || typeof mw !== 'number' || mw <= 0) {
    return 5;
  }
  return 5 + Math.log(mw) * 1.5;
};

function MapContainer({ incidents, selectedIncident, onMarkerClick, onMapLoad }) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_Maps_API_KEY
  });

  const [hoveredIncident, setHoveredIncident] = useState(null);

  return isLoaded ? (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={2} onLoad={onMapLoad}>
      {incidents.map((incident) => {
        const isSelected = selectedIncident?.id === incident.id;
        const scale = calculateMarkerScale(incident.capacity_mw);

        // This check prevents rendering if data is somehow still bad
        if (typeof incident.latitude !== 'number' || typeof incident.longitude !== 'number') {
          return null;
        }

        return (
          <MarkerF
            key={incident.id}
            position={{ lat: incident.latitude, lng: incident.longitude }}
            title={`${incident.location} (${incident.capacity_mw} MW)`}
            onClick={() => onMarkerClick(incident)}
            onMouseOver={() => setHoveredIncident(incident)}
            onMouseOut={() => setHoveredIncident(null)}
            
            icon={{
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: isSelected ? scale * 1.5 : scale,
              fillColor: isSelected ? '#ff0000' : '#007bff',
              fillOpacity: 0.9,
              strokeWeight: 1,
              strokeColor: '#ffffff'
            }}
            zIndex={isSelected ? 100 : 1}
          >
            {hoveredIncident?.id === incident.id && (
              <InfoWindow onCloseClick={() => setHoveredIncident(null)}>
                <div className="map-infowindow">
                  <h4>{incident.location}</h4>
                  <p>{incident.capacity_mw ? `${incident.capacity_mw} MW` : 'Rating N/A'}</p>
                </div>
              </InfoWindow>
            )}
          </MarkerF>
        )
      })}
    </GoogleMap>
  ) : <></>;
}

export default React.memo(MapContainer);