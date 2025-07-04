import React, { useState, useEffect } from 'react';
import MapContainer from './components/MapContainer';
import IncidentList from './components/IncidentList';
import FilterControls from './components/FilterControls'; // Import the new component
import incidentData from './data/incidents.json';
import './App.css';

function App() {
  const [incidents] = useState(incidentData);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [mapRef, setMapRef] = useState(null);

  // --- NEW: State for field visibility ---
  const [fieldVisibility, setFieldVisibility] = useState({
    country: true,
    year: true,
    capacity_mw: true,
    capacity_mwh: true,
    description: true,
    battery_modules: false,
    enclosure_type: false,
    failed_element: false,
    root_cause: false,
  });

  // --- NEW: Function to handle checkbox toggles ---
  const handleVisibilityChange = (field) => {
    setFieldVisibility(prevVisibility => ({
      ...prevVisibility,
      [field]: !prevVisibility[field],
    }));
  };

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
          {/* We render the new controls component here */}
          <FilterControls 
            visibility={fieldVisibility}
            onVisibilityChange={handleVisibilityChange}
          />
          <IncidentList
            incidents={incidents}
            selectedIncident={selectedIncident}
            onIncidentSelect={setSelectedIncident}
            // Pass the visibility state down to the list
            fieldVisibility={fieldVisibility}
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