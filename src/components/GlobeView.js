import React, { useState } from 'react';
import Globe from 'react-globe.gl';

// URLs for our two different map textures
const day_texture = "//unpkg.com/three-globe/example/img/earth-day.jpg";
const night_texture = "//unpkg.com/three-globe/example/img/earth-night.jpg";

function GlobeView({ incidents }) {
  // State to keep track of which view is active
  const [isNightMode, setIsNightMode] = useState(true);

  // We format our data into the format the globe library expects
  const globeData = incidents
    .filter(d => typeof d.latitude === 'number' && typeof d.longitude === 'number')
    .map(incident => ({
      lat: incident.latitude,
      lng: incident.longitude,
      size: incident.capacity_mw ? 0.1 + Math.log(incident.capacity_mw + 1) / 10 : 0.1,
      color: '#dc3545', // Using the app's red color for points
      name: incident.location,
    }));

  return (
    <div className="full-page-view">
      {/* A simple toggle button positioned over the globe */}
      <div className="globe-toggle">
        <button onClick={() => setIsNightMode(!isNightMode)}>
          Switch to {isNightMode ? 'Day' : 'Night'} View
        </button>
      </div>
      <Globe
        // The globeImageUrl now dynamically changes based on our state
        globeImageUrl={isNightMode ? night_texture : day_texture}
        pointsData={globeData}
        pointAltitude="size"
        pointColor="color"
        pointLabel="name"
      />
    </div>
  );
}

export default GlobeView;