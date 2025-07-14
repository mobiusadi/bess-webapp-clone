import React, { useState, useMemo } from 'react';

const FILTERABLE_COLUMNS = ['country', 'year', 'installation', 'application', 'enclosure_type', 'root_cause'];

function DataTablePage({ incidents }) {
  const [filters, setFilters] = useState({});

  const filteredData = useMemo(() => {
    return incidents.filter(incident => {
      return Object.entries(filters).every(([key, value]) => 
        !value || String(incident[key]) === String(value)
      );
    });
  }, [incidents, filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value === 'All' ? null : value }));
  };

  return (
    <div className="page-container">
      <h2>Interactive Data Table</h2>
      <div className="filter-panel">
        {FILTERABLE_COLUMNS.map(key => {
          const options = [...new Set(incidents.map(i => i[key]))].filter(Boolean).sort();
          return (
            <div key={key} className="filter-control">
              <label>{key.replace(/_/g, ' ').toUpperCase()}</label>
              <select onChange={(e) => handleFilterChange(key, e.target.value)} value={filters[key] || 'All'}>
                <option value="All">All</option>
                {options.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          );
        })}
      </div>
      <div className="results-table-container">
        <p>Showing {filteredData.length} of {incidents.length} incidents.</p>
        <table className="results-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Location</th>
              <th>Country</th>
              <th>Year</th>
              <th>Installation</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.slice(0, 100).map(incident => ( // Show first 100 results
              <tr key={incident.id}>
                <td>{incident.id}</td>
                <td>{incident.location}</td>
                <td>{incident.country}</td>
                <td>{incident.year}</td>
                <td>{incident.installation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default DataTablePage;