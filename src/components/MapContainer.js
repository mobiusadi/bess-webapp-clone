import React, { useState } from 'react';
// We are no longer importing the custom icon
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindow } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%'
};
const center = { lat: 30, lng: 0 };

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
        return (
          <MarkerF
            key={incident.id}
            position={{ lat: incident.latitude, lng: incident.longitude }}
            title={incident.location}
            onClick={() => onMarkerClick(incident)}
            onMouseOver={() => setHoveredIncident(incident)}
            onMouseOut={() => setHoveredIncident(null)}
            
            // Reverted back to the colored circle markers
            icon={{
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: isSelected ? 10 : 7,
              fillColor: isSelected ? '#ff0000' : '#007bff',
              fillOpacity: 1.0,
              strokeWeight: 0,
            }}
          >
            {hoveredIncident?.id === incident.id && (
              <InfoWindow onCloseClick={() => setHoveredIncident(null)}>
                <div className="map-infowindow">
                  <h4>{incident.location}</h4>
                  <p>{incident.year}</p>
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