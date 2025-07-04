import React, { useEffect, useRef } from 'react';

function IncidentList({ incidents, selectedIncident, onIncidentSelect }) {
  const itemRefs = useRef({});

  useEffect(() => {
    if (selectedIncident && itemRefs.current[selectedIncident.id]) {
      itemRefs.current[selectedIncident.id].scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [selectedIncident]);

  return (
    <div className="incident-list">
      {incidents.map((incident) => (
        <div
          ref={(el) => (itemRefs.current[incident.id] = el)}
          key={incident.id}
          className={`incident-item ${selectedIncident?.id === incident.id ? 'selected' : ''}`}
          onClick={() => onIncidentSelect(incident)}
        >
          <h3>{incident.name}</h3>
          <p>{incident.date}</p>
        </div>
      ))}
    </div>
  );
}

export default IncidentList;