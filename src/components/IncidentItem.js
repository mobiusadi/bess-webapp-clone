import React from 'react';

function IncidentItem({ incident, isSelected, onClick }) {
  return (
    <div
      className={`incident-item ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
    >
      {incident.image_url && (
        <img 
          src={incident.image_url} 
          alt={`Incident at ${incident.location_name}`} 
          className="incident-image" 
        />
      )}

      <div className="incident-content">
        <div className="incident-tags">
          {/* These tags will always show if the data exists */}
          {incident.country && <span className="tag tag-country">{incident.country}</span>}
          {incident.year && <span className="tag tag-year">{incident.year}</span>}
          {incident.capacity_mw && <span className="tag tag-power">{incident.capacity_mw} MW</span>}
          {incident.capacity_mwh && <span className="tag tag-energy">{incident.capacity_mwh} MWh</span>}
        </div>
        
        {/* Use the 'location' field from your data */}
        <h3>{incident.location}</h3>
        
        <p className="incident-description">{incident.description}</p>

        {/* --- NEW: A section for more technical details --- */}
        <div className="incident-details">
          {incident.battery_modules && (
            <p><strong>Battery:</strong> {incident.battery_modules}</p>
          )}
          {incident.enclosure_type && (
            <p><strong>Enclosure:</strong> {incident.enclosure_type}</p>
          )}
          {incident.failed_element && (
            <p><strong>Failed Element:</strong> {incident.failed_element}</p>
          )}
        </div>
        
        {incident.root_cause && incident.root_cause.toLowerCase() !== 'unknown cause' && (
            <p className="incident-root-cause">
                <strong>Reported Cause:</strong> {incident.root_cause}
            </p>
        )}
      </div>
    </div>
  );
}

export default IncidentItem;