

import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom'; 

import LeafletMap from './components/MapContainer'; 
import IncidentList from './components/IncidentList';
import DashboardPage from './components/DashboardPage';
import FilterControls from './components/FilterControls'; // Make sure this is imported
import { createClient } from '@supabase/supabase-js';
import './App.css';

const supabaseUrl = 'https://yqxtmjblfluwwdkolinn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxeHRtamJsZmx1d3dka29saW5uIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTY1MzkzNSwiZXhwIjoyMDY3MjI5OTM1fQ.FoCCpOwHYzXog4_12hv91KDQABLFTmyj9-Pt8e5vemI';

const supabase = createClient(supabaseUrl, supabaseKey);

// The MapView component now receives the visibility state and handler function
function MapView({ incidents, fieldVisibility, handleVisibilityChange }) {
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  
  return(
    <>
      <div className="list-container">
        {/* We moved the mobile filter controls here for a cleaner layout */}
        <div className="mobile-filter-container">
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
        <IncidentList
          incidents={incidents}
          selectedIncident={selectedIncident}
          onIncidentSelect={setSelectedIncident}
          fieldVisibility={fieldVisibility} // It correctly passes the prop down
        />
      </div>
      <div className="map-container">
        <LeafletMap
          incidents={incidents}
          selectedIncident={selectedIncident}
          onMarkerClick={setSelectedIncident}
        />
      </div>
    </>
  );
}


function App() {
  const [incidents, setIncidents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [fieldVisibility, setFieldVisibility] = useState({
    country: true, year: true, capacity_mw: true, capacity_mwh: false,
    description: true, battery_modules: false, root_cause: false,
  });

  useEffect(() => {
    const getIncidents = async () => {
      setIsLoading(true);
      let { data, error } = await supabase.from('incidents').select('*').order('event_date', { ascending: false });
      if (error) console.error("Error fetching incidents:", error);
      else if (data) setIncidents(data);
      setIsLoading(false);
    };
    getIncidents();
  }, []);

  const handleVisibilityChange = (field) => {
    setFieldVisibility(prevVisibility => ({ ...prevVisibility, [field]: !prevVisibility[field] }));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>BESS Incident Map</h1>
        <nav>
          <Link to="/">Map View</Link>
          <Link to="/dashboard">Dash</Link>
        </nav>
      </header>

      <main className="App-main">
        {isLoading ? (
          <p className="loading-message">Loading incident data...</p>
        ) : (
          <Routes>
            {/* THIS IS THE FIX: We now pass all the necessary props to MapView */}
            <Route path="/" element={
              <MapView 
                incidents={incidents}
                fieldVisibility={fieldVisibility}
                handleVisibilityChange={handleVisibilityChange}
              />
            } />
            <Route path="/dashboard" element={<DashboardPage incidents={incidents} />} />
          </Routes>
        )}
      </main>
    </div>
  );
}

export default App;