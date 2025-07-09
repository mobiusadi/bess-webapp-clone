import React from 'react';
import ResourceLinkParser from './ResourceLinkParser';

const formatKey = (key) => {
  return key.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
};

const explicitlyHandledKeys = new Set([
  'id', 'latitude', 'longitude', 'image_url', 'location', 'description', 
  'country', 'year', 'event_date', 'capacity_mw', 'capacity_mwh', 'fatalities', 'injuries',
  'root_cause', 'additional_resources', 'system_age_yr' // Add system_age_yr to prevent duplication
]);

// NEW: A helper function to determine the age band
const getAgeBand = (age) => {
  if (typeof age !== 'number' || isNaN(age)) return null;
  if (age < 1) return '< 1yr';
  if (age < 2) return '1-2yr';
  if (age < 3) return '2-3yr';
  if (age < 4) return '3-4yr';
  if (age < 5) return '4-5yr';
  return '5+ yr';
};

function IncidentItem({ incident, isSelected, onClick, fieldVisibility }) {
  const year = incident.event_date ? new Date(String(incident.event_date).replace(' ', 'T')).getFullYear() : null;
  // Get the age band for this incident
  const ageBand = getAgeBand(incident.system_age_yr);

  return (
    <div
      className={`incident-item ${isSelected ? 'selected expanded' : ''}`}
      onClick={onClick}
    >
      {isSelected && incident.image_url && (
        <img 
          src={incident.image_url} 
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
          
          {/* NEW: Conditionally render the new age tag */}
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

export default IncidentItem;