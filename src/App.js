// CHANGED: 'useEffect' has been removed from this import line
import React, { useState } from 'react'; 
import LeafletMap from './components/MapContainer'; 
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
        <h1>BESS Incident Map (Leaflet Version)</h1>
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
          <div className="filter-lozenge-container">
            <button onClick={() => setIsFilterVisible(!isFilterVisible)} className="filter-lozenge-button">
              Filters
            </button>
            {isFilterVisible && (
              <FilterControls 
                visibility={fieldVisibility}
                onVisibilityChange={handleVisibilityChange}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;