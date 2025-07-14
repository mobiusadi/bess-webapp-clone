import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Link } from 'react-router-dom'; 

import MapView from './components/MapView';
import DashboardPage from './components/DashboardPage';
import AdminPage from './components/AdminPage';
import EditIncidentForm from './components/EditIncidentForm';
import AddIncidentForm from './components/AddIncidentForm';
import GlobeView from './components/GlobeView';
import CardGridView from './components/CardGridView';
import DataTablePage from './components/DataTablePage';
import PivotTableView from './components/PivotTableView';
import { supabase } from './supabaseClient';
import './App.css';

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
          <Link to="/">Map</Link>
          <Link to="/globe">Globe</Link>
          <Link to="/grid">Grid</Link>
          <Link to="/table">Table</Link>
          <Link to="/pivot">Pivot</Link>
          <Link to="/dashboard">Dash</Link>
          <Link to="/admin">Admin</Link>
        </nav>
      </header>
      <div className="main-content">
        {isLoading ? ( <p className="loading-message">Loading...</p> ) : (
          <Routes>
            <Route path="/" element={<MapView incidents={incidents} />} />
            <Route path="/globe" element={<GlobeView incidents={incidents} />} />
            <Route path="/grid" element={<CardGridView incidents={incidents} />} />
            <Route path="/table" element={<DataTablePage incidents={incidents} />} />
            <Route path="/pivot" element={<PivotTableView incidents={incidents} />} />
            <Route path="/dashboard" element={<DashboardPage incidents={incidents} />} />
            <Route path="/admin" element={<AdminPage incidents={incidents} />} />
            <Route path="/admin/edit/:id" element={<EditIncidentForm onSave={getIncidents} />} />
            <Route path="/admin/new" element={<AddIncidentForm onSave={getIncidents} />} />
          </Routes>
        )}
      </div>
    </div>
  );
}
export default App;