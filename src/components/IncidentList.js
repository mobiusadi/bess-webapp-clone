import React, { useEffect, useRef } from 'react';
import IncidentItem from './IncidentItem';

function IncidentList({ incidents, selectedIncident, onIncidentSelect, fieldVisibility }) {
  // THIS IS THE FIX: The itemRefs constant was missing. It's now back.
  const itemRefs = useRef({});

  useEffect(() => {
    // Also, add a check to make sure selectedIncident and its id exist
    if (selectedIncident && selectedIncident.id && itemRefs.current[selectedIncident.id]) {
      itemRefs.current[selectedIncident.id].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [selectedIncident]);

  return (
    <div className="incident-list">
      {/* This is a more robust way to map. We filter out any incidents
        that might be missing an 'id' before we try to render them.
        This will solve the "missing key" warning for good.
      */}
      {incidents && incidents
        .filter(incident => incident.id != null) // Ensure incident has a non-null id
        .map((incident) => (
          <div key={incident.id} ref={(el) => (itemRefs.current[incident.id] = el)}>
            <IncidentItem 
              incident={incident}
              isSelected={selectedIncident?.id === incident.id}
              onClick={() => onIncidentSelect(incident)}
              fieldVisibility={fieldVisibility}
            />
          </div>
        ))}
    </div>
  );
}

export default IncidentList;