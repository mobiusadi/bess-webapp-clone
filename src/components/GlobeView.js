import React, { useState, useEffect } from 'react';
import Globe from 'react-globe.gl';

// A small helper function to check if the browser supports WebGL
const isWebGLSupported = () => {
    try {
        const canvas = document.createElement('canvas');
        return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
        return false;
    }
};

function GlobeView({ incidents }) {
  // State to hold the result of our check
  const [supportsWebGL, setSupportsWebGL] = useState(true);

  // Run the check once when the component first loads
  useEffect(() => {
    setSupportsWebGL(isWebGLSupported());
  }, []);

  const globeData = incidents
    .filter(d => d.latitude && d.longitude)
    .map(incident => ({
      lat: incident.latitude,
      lng: incident.longitude,
      size: incident.capacity_mw ? 0.1 + Math.log(incident.capacity_mw + 1) / 10 : 0.1,
      color: 'red',
      name: incident.location,
    }));

  // If WebGL is not supported, show a fallback message
  if (!supportsWebGL) {
    return (
      <div className="page-container">
        <h2>Globe View Not Supported</h2>
        <p>This browser does not support the 3D graphics required for the globe view.</p>
      </div>
    );
  }

  // Otherwise, show the interactive globe
  return (
    <div className="full-page-view">
      <Globe
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-day.jpg"
        backgroundColor="rgba(255,255,255,1)"
        pointsData={globeData}
        pointAltitude="size"
        pointColor="color"
        pointLabel="name"
      />
    </div>
  );
}

export default GlobeView;