import React, { useState } from 'react';
import IncidentItem from './IncidentItem';

function CardGridView({ incidents }) {
  const [expandedId, setExpandedId] = useState(null);

  const handleCardClick = (incidentId) => {
    setExpandedId(currentId => (currentId === incidentId ? null : incidentId));
  };

  return (
    <div className="page-container">
      <h2>Incidents Grid View</h2>
      <div className="card-grid">
        {incidents.map(incident => (
          <IncidentItem
            key={incident.id}
            incident={incident}
            isSelected={expandedId === incident.id}
            onClick={() => handleCardClick(incident.id)}
            fieldVisibility={{}}
          />
        ))}
      </div>
    </div>
  );
}
export default CardGridView;