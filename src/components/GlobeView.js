// src/components/GlobeView.js
import React from 'react';
import Globe from 'react-globe.gl';

const day_texture = "//unpkg.com/three-globe/example/img/earth-day.jpg";
const night_texture = "//unpkg.com/three-globe/example/img/earth-night.jpg";

// The component now receives the isNightMode prop
function GlobeView({ incidents, isNightMode }) {
  const globeData = incidents
    .filter(d => d.latitude && d.longitude)
    .map(incident => ({
      lat: incident.latitude,
      lng: incident.longitude,
      size: incident.capacity_mw ? 0.1 + Math.log(incident.capacity_mw + 1) / 10 : 0.1,
      color: 'red',
      name: incident.location,
    }));

  return (
    <div className="full-page-view">
      <Globe
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