import React, { useState, useEffect } from 'react';
import MapContainer from './components/MapContainer';
import IncidentList from './components/IncidentList';
import incidentData from './data/incidents.json';
import './App.css';

function App() {
  const [incidents] = useState(incidentData);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [mapRef, setMapRef] = useState(null);

  useEffect(() => {
    if (mapRef && selectedIncident) {
      mapRef.panTo({
        lat: selectedIncident.latitude,
        lng: selectedIncident.longitude
      });
      mapRef.setZoom(14);
    }
  }, [selectedIncident, mapRef]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>BESS Incident Map</h1>
      </header>
      <main className="App-main">
        <div className="list-container">
          <IncidentList
            incidents={incidents}
            selectedIncident={selectedIncident}
            onIncidentSelect={setSelectedIncident}
          />
        </div>
        <div className="map-container">
          <MapContainer
            incidents={incidents}
            selectedIncident={selectedIncident}
            onMarkerClick={setSelectedIncident}
            onMapLoad={setMapRef}
          />
        </div>
      </main>
    </div>
  );
}

export default App;