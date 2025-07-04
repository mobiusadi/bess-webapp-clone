import React, { useEffect, useRef } from 'react';
import IncidentItem from './IncidentItem';

// Accept the new fieldVisibility prop
function IncidentList({ incidents, selectedIncident, onIncidentSelect, fieldVisibility }) {
  const itemRefs = useRef({});

  useEffect(() => {
    if (selectedIncident && itemRefs.current[selectedIncident.id]) {
      itemRefs.current[selectedIncident.id].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
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
            // Pass the prop along to the item
            fieldVisibility={fieldVisibility}
          />
        </div>
      ))}
    </div>
  );
}

export default IncidentList;