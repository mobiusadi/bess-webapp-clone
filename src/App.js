import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Link } from 'react-router-dom'; 

import LeafletMap from './components/MapContainer'; 
import IncidentList from './components/IncidentList';
import DashboardPage from './components/DashboardPage';
import AdminPage from './components/AdminPage';
import EditIncidentForm from './components/EditIncidentForm';
import AddIncidentForm from './components/AddIncidentForm';
import { supabase } from './supabaseClient';
import './App.css';

// The MapView component is a clean way to group the main page's logic
function MapView({ incidents, onSave }) {
  const [selectedIncident, setSelectedIncident] = useState(null);
  // Filter state and logic now lives here, specific to this view
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [fieldVisibility, setFieldVisibility] = useState({
    country: true, year: true, capacity_mw: true,
    capacity_mwh: true, system_age_yr: true, description: true,
    battery_modules: false, root_cause: false,
  });

  const handleVisibilityChange = (field) => {
    setFieldVisibility(prev => ({ ...prev, [field]: !prev[field] }));
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
  
  const getIncidents = useCallback(async () => {
    setIsLoading(true);
    let { data, error } = await supabase.from('incidents').select('*').order('event_date', { ascending: false });
    if (error) console.error("Error fetching incidents:", error);
    else if (data) setIncidents(data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    getIncidents();
  }, [getIncidents]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>BESS Incident Map</h1>
        <nav>
          <Link to="/">Map View</Link>
          {/* THIS IS THE FIX: Changed </A> to </Link> */}
          <Link to="/dashboard">Dash</Link>
          <Link to="/admin">Admin</Link>
        </nav>
      </header>

      <main className="App-main">
        {isLoading ? (
          <p className="loading-message">Loading incident data...</p>
        ) : (
          <Routes>
            <Route path="/" element={<MapView incidents={incidents} onSave={getIncidents} />} />
            <Route path="/dashboard" element={<DashboardPage incidents={incidents} />} />
            <Route path="/admin" element={<AdminPage incidents={incidents} />} />
            <Route path="/admin/edit/:id" element={<EditIncidentForm onSave={getIncidents} />} />
            <Route path="/admin/new" element={<AddIncidentForm onSave={getIncidents} />} />
          </Routes>
        )}
      </main>
    </div>
  );
}

export default App;