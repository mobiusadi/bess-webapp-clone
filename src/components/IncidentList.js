import React, { useEffect, useRef } from 'react';
import IncidentItem from './IncidentItem'; // Import our new component

function IncidentList({ incidents, selectedIncident, onIncidentSelect }) {
  const itemRefs = useRef({});

  useEffect(() => {
    if (selectedIncident && itemRefs.current[selectedIncident.id]) {
      itemRefs.current[selectedIncident.id].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest', // 'nearest' is often a smoother scroll experience
      });
    }
  }, [selectedIncident]);

  return (
    <div className="incident-list">
      {incidents.map((incident) => (
        <div key={incident.id} ref={(el) => (itemRefs.current[incident.id] = el)}>
          <IncidentItem 
            incident={incident}
            isSelected={selectedIncident?.id === incident.id}
            onClick={() => onIncidentSelect(incident)}
          />
        </div>
      ))}
    </div>
  );
}

export default IncidentList;