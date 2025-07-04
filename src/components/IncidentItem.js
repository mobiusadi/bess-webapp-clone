import React from 'react';

// This is a "presentational" component. It just receives data (props) and displays it.
function IncidentItem({ incident, isSelected, onClick }) {
  // This is called "conditional rendering". 
  // The '&&' means the <img> tag will only be rendered if incident.image_url exists.
  const imageElement = incident.image_url && (
    <img 
      src={incident.image_url} 
      alt={`Incident at ${incident.location_name}`} 
      className="incident-image" 
    />
  );

  return (
    <div
      className={`incident-item ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
    >
      {/* If an image exists, display it on top */}
      {imageElement}

      <div className="incident-content">
        <h3>{incident.location_name}</h3>
        <h4>{incident.country} ({incident.year})</h4>
        <p><strong>Date:</strong> {incident.event_date}</p>
        <p>{incident.description}</p>
        <p><strong>Reported Cause:</strong> {incident.root_cause}</p>
      </div>
    </div>
  );
}

export default IncidentItem;