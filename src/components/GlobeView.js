import React, { useState, useEffect } from 'react';
import Globe from 'react-globe.gl';

// Helper function to check for WebGL support
const isWebGLSupported = () => {
    try {
        const canvas = document.createElement('canvas');
        return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) { return false; }
};

function GlobeView({ incidents }) {
  const [supportsWebGL, setSupportsWebGL] = useState(true);

  useEffect(() => {
    setSupportsWebGL(isWebGLSupported());
  }, []);

  if (!supportsWebGL) {
    return (
      <div className="page-container">
        <h2>Globe View Not Supported</h2>
        <p>This browser or device does not support the 3D graphics required for the globe view.</p>
      </div>
    );
  }

  // If WebGL is supported, show the globe
  const globeData = incidents.filter(d => d.latitude && d.longitude).map(d => ({ /* ...data mapping... */ }));
  return (
    <div className="full-page-view">
      <Globe globeImageUrl="//unpkg.com/three-globe/example/img/earth-day.jpg" pointsData={globeData} /* ...other props... */ />
    </div>
  );
}

export default GlobeView;