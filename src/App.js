import React, { useState, useEffect } from 'react';
// NEW: Add imports for routing and the dashboard page
import { Routes, Route, Link } from 'react-router-dom';
import DashboardPage from './components/DashboardPage';

import LeafletMap from './components/MapContainer'; 
import IncidentList from './components/IncidentList';
import FilterControls from './components/FilterControls';
import { createClient } from '@supabase/supabase-js';
import './App.css';
import filterIcon from './assets/icon-filter.png';

// Read the keys securely from environment variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

function App() {
  const [incidents, setIncidents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [fieldVisibility, setFieldVisibility] = useState({
    country: true,
    year: true,
    capacity_mw: true,
    capacity_mwh: false,
    description: true,
    system_age_yr: true,
    battery_modules: false,
    root_cause: false,
  });

  useEffect(() => {
    const getIncidents = async () => {
      setIsLoading(true);
      console.log("Attempting to fetch from Supabase...");
      console.log("Using URL:", supabaseUrl ? "URL is set" : "URL IS MISSING!");

      let { data, error } = await supabase
        .from('incidents')
        .select('*')
        .order('event_date', { ascending: false });

      if (error) {
        console.error("Error fetching incidents from Supabase:", error);
        setError(error.message);
      } else if (data) {
        console.log("Data successfully fetched!", data);
        setIncidents(data);
      } else {
        console.log("Fetch was successful but no data was returned.");
      }
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
        ) : error ? (
          <p className="error-message">Error: {error}</p>
        ) : (
          <Routes>
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

// MapView component remains here
function MapView({ incidents, fieldVisibility, handleVisibilityChange }) {
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  
  return(
    <>
      <div className="list-container">
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
  );
}

export default App;