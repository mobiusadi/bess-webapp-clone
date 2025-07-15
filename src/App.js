import React, { useState, useEffect, useCallback } from 'react';
// THIS IS THE FIX: Added BrowserRouter to the import list
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'; 
import { AuthProvider, useAuth } from './AuthContext';

// Import all your components
import MapView from './components/MapView';
import DashboardPage from './components/DashboardPage';
import AdminPage from './components/AdminPage';
import EditIncidentForm from './components/EditIncidentForm';
import AddIncidentForm from './components/AddIncidentForm';
import GlobeView from './components/GlobeView';
import CardGridView from './components/CardGridView';
import DataTablePage from './components/DataTablePage';
import LoginPage from './components/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';

import { supabase } from './supabaseClient';
import './App.css';

// Import new icons
import sunIcon from './assets/icon-sun.png';
import moonIcon from './assets/icon-moon.png';

function App() {
  const [incidents, setIncidents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isNightMode, setIsNightMode] = useState(true);
  const location = useLocation();
  const auth = useAuth(); // Access auth state for logout button

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
          <Link to="/dashboard">Dash</Link>
          <Link to="/admin">Admin</Link>
        </nav>
        
        <div className="header-actions">
          {location.pathname === '/globe' && (
            <button onClick={() => setIsNightMode(!isNightMode)} className="header-icon-button">
              <img src={isNightMode ? sunIcon : moonIcon} alt="Toggle Day/Night" />
            </button>
          )}
          {/* Show logout button if user is authenticated */}
          {auth.isAuthenticated && <button onClick={auth.logout} className="logout-button">Logout</button>}
        </div>
      </header>
      <div className="main-content">
        {isLoading ? ( <p className="loading-message">Loading...</p> ) : (
          <Routes>
            <Route path="/" element={<MapView incidents={incidents} />} />
            <Route path="/globe" element={<GlobeView incidents={incidents} isNightMode={isNightMode} />} />
            <Route path="/grid" element={<CardGridView incidents={incidents} />} />
            <Route path="/table" element={<DataTablePage incidents={incidents} />} />
            <Route path="/dashboard" element={<DashboardPage incidents={incidents} />} />
            <Route path="/login" element={<LoginPage />} />

            <Route path="/admin" element={<ProtectedRoute><AdminPage incidents={incidents} /></ProtectedRoute>} />
            <Route path="/admin/edit/:id" element={<ProtectedRoute><EditIncidentForm onSave={getIncidents} /></ProtectedRoute>} />
            <Route path="/admin/new" element={<ProtectedRoute><AddIncidentForm onSave={getIncidents} /></ProtectedRoute>} />
          </Routes>
        )}
      </div>
    </div>
  );
}

// We wrap the App in the router AND the auth provider
function AppWrapper() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default AppWrapper;