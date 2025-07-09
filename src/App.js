import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom'; 

import LeafletMap from './components/MapContainer'; 
import IncidentList from './components/IncidentList';
import DashboardPage from './components/DashboardPage';
import AdminPage from './components/AdminPage';
import EditIncidentForm from './components/EditIncidentForm';
// THIS IS THE FIX: We need to import the FilterControls component to use it
import FilterControls from './components/FilterControls'; 
import { createClient } from '@supabase/supabase-js';
import './App.css';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// The MapView component now correctly manages all state related to the map page
function MapView({ incidents }) {
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [fieldVisibility, setFieldVisibility] = useState({
    country: true, year: true, capacity_mw: true, capacity_mwh: true,
    system_age_yr: true, description: true, battery_modules: false, root_cause: false,
    integrator: false, enclosure_type: false, state_during_accident: false, 
    installation: false, application: false,
  });

  const handleVisibilityChange = (field) => {
    setFieldVisibility(prevVisibility => ({ ...prevVisibility, [field]: !prevVisibility[field] }));
  };
  
  return(
    <>
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
  );
}


function App() {
  const [incidents, setIncidents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
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

  return (
    <div className="App">
      <header className="App-header">
        <h1>BESS Incident Map</h1>
        <nav>
          <Link to="/">Map View</Link>
          <Link to="/dashboard">Dash</Link>
          <Link to="/admin">Admin</Link>
        </nav>
      </header>

      <main className="App-main">
        {isLoading ? (
          <p className="loading-message">Loading incident data...</p>
        ) : (
          <Routes>
            <Route path="/" element={<MapView incidents={incidents} />} />
            <Route path="/dashboard" element={<DashboardPage incidents={incidents} />} />
            <Route path="/admin" element={<AdminPage incidents={incidents} />} />
            <Route path="/admin/edit/:id" element={<EditIncidentForm />} />
          </Routes>
        )}
      </main>
    </div>
  );
}

export default App;