import React from 'react';

// A helper function to make field names more readable (e.g., 'root_cause' -> 'Root Cause')
const formatFieldName = (fieldName) => {
  return fieldName
    .replace(/_/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
};

function FilterControls({ visibility, onVisibilityChange }) {
  return (
    <div className="filter-controls">
      <h4>Show/Hide Fields:</h4>
      <div className="checkbox-grid">
        {/* We dynamically create a checkbox for each key in our visibility state object */}
        {Object.keys(visibility).map((field) => (
          <div key={field} className="checkbox-item">
            <input
              type="checkbox"
              id={`checkbox-${field}`}
              checked={visibility[field]}
              onChange={() => onVisibilityChange(field)}
            />
            <label htmlFor={`checkbox-${field}`}>
              {formatFieldName(field)}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FilterControls;