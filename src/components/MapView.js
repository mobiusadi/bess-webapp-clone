import React, { useState } from 'react';
import LeafletMap from './MapContainer'; 
import IncidentList from './IncidentList';
import FilterControls from './FilterControls';
import filterIcon from '../assets/icon-filter.png';

function MapView({ incidents }) {
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [fieldVisibility, setFieldVisibility] = useState({
    country: true, year: true, capacity_mw: true,
    capacity_mwh: true, system_age_yr: true, description: true,
    battery_modules: false, root_cause: false,
    integrator: false, enclosure_type: false,
    state_during_accident: false, installation: false, application: false,
  });

  const handleVisibilityChange = (field) => {
    setFieldVisibility(prev => ({ ...prev, [field]: !prev[field] }));
  };
  
  return(
    // This is the main container for the side-by-side view
    <div className="map-view-container">
      <div className="list-container">
        <IncidentList
          incidents={incidents}
          selectedIncident={selectedIncident}
          onIncidentSelect={setSelectedIncident}
          fieldVisibility={fieldVisibility}
        />
      </div>
      <div className="map-container">
        <div className="filter-lozenge-container">
            <button onClick={() => setIsFilterVisible(!isFilterVisible)} className="filter-toggle-button">
              <img src={filterIcon} alt="Filters" />
            </button>
            {isFilterVisible && (
              <FilterControls 
                visibility={fieldVisibility}
                onVisibilityChange={handleVisibilityChange}
              />
            )}
        </div>
        <LeafletMap
          incidents={incidents}
          selectedIncident={selectedIncident}
          onMarkerClick={setSelectedIncident}
        />
      </div>
    </div>
  );
}

export default MapView;