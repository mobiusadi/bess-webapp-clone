import React, { Suspense, useCallback, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import { supabase } from './supabaseClient';
import './App.css';

// Import icons
import sunIcon from './assets/icon-sun.png';
import moonIcon from './assets/icon-moon.png';

// --- THIS IS THE FIX: Code Splitting with React.lazy ---
// We now import our "heavy" page components using React.lazy
// This tells React to load their code only when they are needed.
const MapView = React.lazy(() => import('./components/MapView'));
const DashboardPage = React.lazy(() => import('./components/DashboardPage'));
const AdminPage = React.lazy(() => import('./components/AdminPage'));
const EditIncidentForm = React.lazy(() => import('./components/EditIncidentForm'));
const AddIncidentForm = React.lazy(() => import('./components/AddIncidentForm'));
const GlobeView = React.lazy(() => import('./components/GlobeView'));
const CardGridView = React.lazy(() => import('./components/CardGridView'));
const DataTablePage = React.lazy(() => import('./components/DataTablePage'));
const PivotTableView = React.lazy(() => import('./components/PivotTableView'));
const LoginPage = React.lazy(() => import('./components/LoginPage'));
const ProtectedRoute = React.lazy(() => import('./components/ProtectedRoute'));

// A simple loading component to show while pages are being downloaded
const Loading = () => <p className="loading-message">Loading page...</p>;

function App() {
  const [incidents, setIncidents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isNightMode, setIsNightMode] = useState(true);
  const location = useLocation();
  const auth = useAuth();

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
        <div className="header-actions">
          {location.pathname === '/globe' && (
            <button onClick={() => setIsNightMode(!isNightMode)} className="header-icon-button">
              <img src={isNightMode ? sunIcon : moonIcon} alt="Toggle Day/Night" />
            </button>
          )}
          {auth.isAuthenticated && <button onClick={auth.logout} className="logout-button">Logout</button>}
        </div>
      </header>
      <div className="main-content">
        {/* The <Suspense> component shows a loading message while the page code is downloaded */}
        <Suspense fallback={<Loading />}>
          {isLoading ? ( <p className="loading-message">Loading incidents...</p> ) : (
            <Routes>
              <Route path="/" element={<MapView incidents={incidents} />} />
              <Route path="/globe" element={<GlobeView incidents={incidents} isNightMode={isNightMode} />} />
              <Route path="/grid" element={<CardGridView incidents={incidents} />} />
              <Route path="/table" element={<DataTablePage incidents={incidents} />} />
              <Route path="/pivot" element={<PivotTableView incidents={incidents} />} />
              <Route path="/dashboard" element={<DashboardPage incidents={incidents} />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/admin" element={<ProtectedRoute><AdminPage incidents={incidents} /></ProtectedRoute>} />
              <Route path="/admin/edit/:id" element={<ProtectedRoute><EditIncidentForm onSave={getIncidents} /></ProtectedRoute>} />
              <Route path="/admin/new" element={<ProtectedRoute><AddIncidentForm onSave={getIncidents} /></ProtectedRoute>} />
            </Routes>
          )}
        </Suspense>
      </div>
    </div>
  );
}

// AppWrapper remains the same
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