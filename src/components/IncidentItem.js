import React from 'react';
import ResourceLinkParser from './ResourceLinkParser';

// Helper function to format keys
const formatKey = (key) => {
  return key.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
};

// A list of keys we handle in a special way to avoid duplicating them
const explicitlyHandledKeys = new Set([
  'id', 'latitude', 'longitude', 'location', 'description', 
  'country', 'year', 'event_date', 'capacity_mw', 'capacity_mwh', 'system_age_yr',
  'additional_resources', 'image_url_1', 'image_url_2', 'image_url_3'
]);

function IncidentItem({ incident, isSelected, onClick, fieldVisibility }) {
  const year = incident.event_date ? new Date(String(incident.event_date).replace(' ', 'T')).getFullYear() : null;
  const ageBand = getAgeBand(incident.system_age_yr);

  return (
    <div
      className={`incident-item ${isSelected ? 'selected expanded' : ''}`}
      onClick={onClick}
    >
      {/* --- THIS IS THE FIX --- */}
      {/* When the card is selected, AND an image_url_1 exists, show the image */}
      {isSelected && incident.image_url_1 && (
        <img 
          src={incident.image_url_1} 
          alt={`Incident at ${incident.location}`} 
          className="incident-image" 
        />
      )}

      <div className="incident-content">
        <div className="incident-tags">
          {(fieldVisibility.country || isSelected) && incident.country && <span className="tag tag-country">{incident.country}</span>}
          {(fieldVisibility.year || isSelected) && year && <span className="tag tag-year">{year}</span>}
          {(fieldVisibility.capacity_mw || isSelected) && incident.capacity_mw && <span className="tag tag-power">{incident.capacity_mw} MW</span>}
          {(fieldVisibility.capacity_mwh || isSelected) && incident.capacity_mwh && <span className="tag tag-energy">{incident.capacity_mwh} MWh</span>}
          {(fieldVisibility.system_age_yr || isSelected) && ageBand && <span className="tag tag-age">{ageBand}</span>}
        </div>
        
        <h3>{incident.location}</h3>
        
        {(fieldVisibility.description || isSelected) && <p className="incident-description">{incident.description}</p>}

        {isSelected && (
          <div className="full-details-list">
            <h4>Full Incident Details:</h4>
            {incident.additional_resources && (
              <ResourceLinkParser 
                resourceKey="additional_resources"
                resourceString={incident.additional_resources}
              />
            )}
            {Object.entries(incident).map(([key, value]) => {
              if (explicitlyHandledKeys.has(key) || !value) return null;
              if (key.endsWith('_title')) return null;
              if (typeof value === 'object' && value !== null) return null;

              if (typeof value === 'string' && value.startsWith('http')) {
                const titleKey = `${key}_title`;
                const title = incident[titleKey] || 'View Source';
                return (
                  <p key={key}>
                    <strong>{formatKey(key)}:</strong> 
                    <a href={value} target="_blank" rel="noopener noreferrer"> {title}</a>
                  </p>
                );
              }
              return (
                <p key={key}><strong>{formatKey(key)}:</strong> {String(value)}</p>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// We need to move the getAgeBand function outside or keep it inside
function getAgeBand(age) {
  if (typeof age !== 'number' || isNaN(age)) return null;
  if (age < 1) return '< 1yr';
  if (age < 2) return '1-2yr';
  if (age < 3) return '2-3yr';
  if (age < 4) return '4-5yr';
  if (age < 5) return '4-5yr'; // Corrected this band
  return '5+ yr';
};

export default IncidentItem;