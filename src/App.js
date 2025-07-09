import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom'; 

import LeafletMap from './components/MapContainer'; 
import IncidentList from './components/IncidentList';
import DashboardPage from './components/DashboardPage';
import AdminPage from './components/AdminPage';
import EditIncidentForm from './components/EditIncidentForm';
import { createClient } from '@supabase/supabase-js';
import './App.css';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// MapView component now correctly receives and passes all necessary props
function MapView({ incidents, selectedIncident, setSelectedIncident, fieldVisibility }) {
  return(
    <>
      <div className="list-container">
        <IncidentList
          incidents={incidents}
          selectedIncident={selectedIncident}
          onIncidentSelect={setSelectedIncident}
          fieldVisibility={fieldVisibility} // This prop was missing before
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
  const [selectedIncident, setSelectedIncident] = useState(null); // Moved state here
  
  const [fieldVisibility, setFieldVisibility] = useState({
    country: true, year: true, capacity_mw: true,
    capacity_mwh: true, system_age_yr: true, description: true,
    battery_modules: false, root_cause: false,
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
            <Route path="/" element={
              <MapView 
                incidents={incidents}
                selectedIncident={selectedIncident}
                setSelectedIncident={setSelectedIncident}
                fieldVisibility={fieldVisibility}
              />
            } />
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