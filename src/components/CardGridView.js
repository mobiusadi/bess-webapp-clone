// src/components/CardGridView.js
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
            // THIS IS THE FIX: We pass a 'true' for all fields
            // so the tags are always visible in the grid view.
            fieldVisibility={{
              country: true, year: true, capacity_mw: true,
              capacity_mwh: true, system_age_yr: true
            }} 
          />
        ))}
      </div>
    </div>
  );
}

export default CardGridView;