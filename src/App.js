import React, { useState, useEffect } from 'react';
import MapContainer from './components/MapContainer';
import IncidentList from './components/IncidentList';
import FilterControls from './components/FilterControls';
import incidentData from './data/incidents.json';
import './App.css';

function App() {
  const [incidents] = useState(incidentData);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [mapRef, setMapRef] = useState(null);
  
  // NEW: State to control the visibility of the filter dropdown
  const [isFilterVisible, setIsFilterVisible] = useState(false);

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
        <div className="header-controls">
          {/* This button will toggle the filter dropdown */}
          <button onClick={() => setIsFilterVisible(!isFilterVisible)} className="filter-toggle-button">
            Filters
          </button>
          {/* The FilterControls are now rendered conditionally here */}
          {isFilterVisible && (
            <FilterControls 
              visibility={fieldVisibility}
              onVisibilityChange={handleVisibilityChange}
            />
          )}
        </div>
      </header>
      <main className="App-main">
        <div className="list-container">
          <IncidentList
            incidents={incidents}
            selectedIncident={selectedIncident}
            onIncidentSelect={setSelectedIncident}
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