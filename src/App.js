import React, { useState, useEffect } from 'react';
import MapContainer from './components/MapContainer';
import IncidentList from './components/IncidentList';
import FilterControls from './components/FilterControls';
import incidentData from './data/incidents.json';
import './App.css';

const sortedIncidents = incidentData.sort((a, b) => {
  const dateA = a.event_date ? new Date(a.event_date) : 0;
  const dateB = b.event_date ? new Date(b.event_date) : 0;
  return dateB - dateA;
});

function App() {
  const [incidents] = useState(sortedIncidents);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [mapRef, setMapRef] = useState(null);
  
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
    }
  }, [selectedIncident, mapRef]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>BESS Incident Map</h1>
        <div className="header-controls">
          <button onClick={() => setIsFilterVisible(!isFilterVisible)} className="filter-toggle-button">
            Filters
          </button>
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