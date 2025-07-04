import React from 'react';

// Accept the new fieldVisibility prop
function IncidentItem({ incident, isSelected, onClick, fieldVisibility }) {
  return (
    <div
      className={`incident-item ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
    >
      {incident.image_url && (
        <img 
          src={incident.image_url} 
          alt={`Incident at ${incident.location}`} 
          className="incident-image" 
        />
      )}

      <div className="incident-content">
        <div className="incident-tags">
          {/* Each tag is now conditional */}
          {fieldVisibility.country && incident.country && <span className="tag tag-country">{incident.country}</span>}
          {fieldVisibility.year && incident.year && <span className="tag tag-year">{incident.year}</span>}
          {fieldVisibility.capacity_mw && incident.capacity_mw && <span className="tag tag-power">{incident.capacity_mw} MW</span>}
          {fieldVisibility.capacity_mwh && incident.capacity_mwh && <span className="tag tag-energy">{incident.capacity_mwh} MWh</span>}
        </div>
        
        <h3>{incident.location}</h3>
        
        {fieldVisibility.description && <p className="incident-description">{incident.description}</p>}

        <div className="incident-details">
          {fieldVisibility.battery_modules && incident.battery_modules && (
            <p><strong>Battery:</strong> {incident.battery_modules}</p>
          )}
          {fieldVisibility.enclosure_type && incident.enclosure_type && (
            <p><strong>Enclosure:</strong> {incident.enclosure_type}</p>
          )}
          {fieldVisibility.failed_element && incident.failed_element && (
            <p><strong>Failed Element:</strong> {incident.failed_element}</p>
          )}
        </div>
        
        {fieldVisibility.root_cause && incident.root_cause && incident.root_cause.toLowerCase() !== 'unknown cause' && (
            <p className="incident-root-cause">
                <strong>Reported Cause:</strong> {incident.root_cause}
            </p>
        )}
      </div>
    </div>
  );
}

export default IncidentItem;