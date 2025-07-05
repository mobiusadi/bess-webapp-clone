import React, { useState } from 'react';
import LeafletMap from './components/MapContainer'; 
import IncidentList from './components/IncidentList';
import FilterControls from './components/FilterControls';
import incidentData from './data/incidents.json';
import './App.css';
// NEW: Import the filter icon
import filterIcon from './assets/icon-filter.png';

const sortedIncidents = incidentData.sort((a, b) => {
  const dateA = new Date(a.event_date.replace(' ', 'T'));
  const dateB = new Date(b.event_date.replace(' ', 'T'));
  return isNaN(dateA.getTime()) ? 1 : isNaN(dateB.getTime()) ? -1 : dateB - dateA;
});

function App() {
  const [incidents] = useState(sortedIncidents);
  const [selectedIncident, setSelectedIncident] = useState(null);
  
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

  return (
    <div className="App">
      <header className="App-header">
        <h1>BESS Incident Map</h1>
        {/* The filter logic is now back in the header */}
        <div className="header-controls">
          <button onClick={() => setIsFilterVisible(!isFilterVisible)} className="filter-toggle-button">
            {/* Use the imported icon instead of text */}
            <img src={filterIcon} alt="Filters" />
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
          <LeafletMap
            incidents={incidents}
            selectedIncident={selectedIncident}
            onMarkerClick={setSelectedIncident}
          />
        </div>
      </main>
    </div>
  );
}

export default App;