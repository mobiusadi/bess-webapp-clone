import React from 'react';
import { GoogleMap, useJsApiLoader, MarkerF } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%'
};

const center = {
  lat: 34.052235,
  lng: -118.243683
};

function MapContainer({ incidents, selectedIncident, onMarkerClick, onMapLoad }) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_Maps_API_KEY
  });

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={4}
      onLoad={onMapLoad}
    >
      {incidents.map((incident) => (
        <MarkerF
          key={incident.id}
          position={{ lat: incident.latitude, lng: incident.longitude }}
          title={incident.name}
          onClick={() => onMarkerClick(incident)}
          // Change marker icon if selected
          icon={{
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: selectedIncident?.id === incident.id ? 10 : 7,
            fillColor: selectedIncident?.id === incident.id ? '#ff0000' : '#007bff',
            fillOpacity: 1.0,
            strokeWeight: 0,
          }}
        />
      ))}
    </GoogleMap>
  ) : <></>;
}

export default React.memo(MapContainer);