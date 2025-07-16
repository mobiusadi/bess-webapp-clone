import React from 'react';
import Globe from 'react-globe.gl';

function GlobeView({ incidents }) {
  const globeData = incidents
    .filter(d => d.latitude && d.longitude)
    .map(incident => ({
      lat: incident.latitude,
      lng: incident.longitude,
      size: incident.capacity_mw ? 0.1 + Math.log(incident.capacity_mw + 1) / 10 : 0.1,
      color: '#dc3545', // Red points to stand out on the light globe
      name: incident.location,
    }));

  return (
    <div className="full-page-view">
      <Globe
        // THIS IS THE FIX: Set the background to solid white
        backgroundColor="rgba(255,255,255,1)"
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-day.jpg"
        pointsData={globeData}
        pointAltitude="size"
        pointColor="color"
        pointLabel="name"
      />
    </div>
  );
}

export default GlobeView;

//this is just to push a commit