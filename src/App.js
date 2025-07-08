



import React, { useState, useEffect } from 'react';
import LeafletMap from './components/MapContainer'; 
import IncidentList from './components/IncidentList';
import FilterControls from './components/FilterControls';
import { createClient } from '@supabase/supabase-js';
import './App.css';
import filterIcon from './assets/icon-filter.png';

/// --- Initialize the Supabase Client ---
// Add your specific Supabase URL and public anon key here
const supabaseUrl = 'https://yqxtmjblfluwwdkolinn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxeHRtamJsZmx1d3dka29saW5uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2NTM5MzUsImV4cCI6MjA2NzIyOTkzNX0.OWEYSHvxAtTo6Decm_r-FSc_zfXwLFlfgQ_cMpRbIXQ';
const supabase = createClient(supabaseUrl, supabaseKey);

function App() {
  // State now starts as empty. It will be filled with live data.
  const [incidents, setIncidents] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // A new state to track loading
  
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [fieldVisibility, setFieldVisibility] = useState({
    country: true,
    year: true,
    capacity_mw: true,
    capacity_mwh: false,
    description: true,
    battery_modules: false,
    root_cause: false,
  });

  // --- NEW: This useEffect hook fetches data from Supabase when the app loads ---
  useEffect(() => {
    const getIncidents = async () => {
      setIsLoading(true); // Tell the app we are loading data

      // Fetch all rows from your 'incidents' table, ordered by date
      let { data, error } = await supabase
        .from('incidents')
        .select('*')
        .order('event_date', { ascending: false });

      if (error) {
        console.error("Error fetching incidents from Supabase:", error);
      } else if (data) {
        setIncidents(data); // Put the loaded data into our state
      }
      setIsLoading(false); // Tell the app we are done loading
    };

    getIncidents();
  }, []); // The empty array [] ensures this runs only once.

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
        <div className="header-controls">
          <button onClick={() => setIsFilterVisible(!isFilterVisible)} className="filter-toggle-button">
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
        {/* If the app is loading, show a message. Otherwise, show the content. */}
        {isLoading ? (
          <p className="loading-message">Loading incident data from database...</p>
        ) : (
          <>
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
          </>
        )}
      </main>
    </div>
  );
}

export default App;