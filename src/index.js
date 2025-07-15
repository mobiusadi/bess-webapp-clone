import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// Change the import from App to AppWrapper
import AppWrapper from './App'; 
import 'leaflet/dist/leaflet.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* Render the AppWrapper component */}
    <AppWrapper />
  </React.StrictMode>
);