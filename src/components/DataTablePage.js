import React, { useState, useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const FILTERABLE_COLUMNS = ['country', 'year', 'installation', 'application', 'enclosure_type', 'root_cause', 'battery_modules'];

function DataTablePage({ incidents }) {
  const [filters, setFilters] = useState({});

  const filteredData = useMemo(() => {
    let data = incidents;
    // Sequentially apply each active filter from the state
    for (const key in filters) {
      const filterValue = filters[key];
      if (filterValue) {
        if (key === 'year') {
          // Special filtering logic for the 'year' category
          data = data.filter(incident => {
            if (!incident.event_date) return false;
            const incidentYear = new Date(incident.event_date).getFullYear();
            return String(incidentYear) === String(filterValue);
          });
        } else {
          // Standard filtering for all other text-based categories
          data = data.filter(incident => String(incident[key]) === String(filterValue));
        }
      }
    }
    return data;
  }, [incidents, filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [key]: value === 'All' ? null : value,
    }));
  };

  // --- Chart.js Configuration ---
  const chartData = {
    labels: filteredData.map(d => `${d.location} (ID: ${d.id})`),
    datasets: [{
      label: 'Capacity (MW)',
      data: filteredData.map(d => d.capacity_mw),
      backgroundColor: 'rgba(220, 53, 69, 0.7)',
    }],
  };
  const chartOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { y: { ticks: { font: { size: 10 } } } }
  };

  return (
    <div className="data-table-page">
      <h2>Interactive Data Explorer</h2>

      {/* Filter Controls Section */}
      <div className="filter-panel">
        {FILTERABLE_COLUMNS.map(key => {
          let options;
          // --- THIS IS THE FIX ---
          // If the key is 'year', derive the options from the event_date.
          if (key === 'year') {
            options = [...new Set(incidents.map(i => {
              if (!i.event_date) return null;
              return new Date(i.event_date).getFullYear();
            }))]
              .filter(year => year != null)
              .sort((a, b) => b - a); // Sort years descending
          } else {
            // For all other text-based columns
            options = [...new Set(incidents.map(i => i[key]))]
              .filter(Boolean)
              .sort();
          }
          
          return (
            <div key={key} className="filter-control">
              <label>{key.replace(/_/g, ' ').toUpperCase()}</label>
              <select onChange={(e) => handleFilterChange(key, e.target.value)} value={filters[key] || 'All'}>
                <option value="All">All</option>
                {options.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          );
        })}
      </div>

      {/* Results Table */}
      <div className="results-table-container">
        <p>Showing {filteredData.length} of {incidents.length} incidents.</p>
        <table className="results-table">
          <thead>
            <tr>
              <th>Location</th>
              <th>Country</th>
              <th>Year</th>
              <th>Installation</th>
              <th>Battery</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.slice(0, 200).map(incident => (
              <tr key={incident.id}>
                <td>{incident.location}</td>
                <td>{incident.country}</td>
                {/* Also derive the year for display here */}
                <td>{incident.event_date ? new Date(incident.event_date).getFullYear() : 'N/A'}</td>
                <td>{incident.installation}</td>
                <td>{incident.battery_modules}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Chart of Filtered Data */}
      <div className="chart-section">
          <h3>Filtered Results by Capacity (MW)</h3>
          <div className="chart-container" style={{ height: '1200px' }}>
            <Bar options={chartOptions} data={chartData} />
          </div>
      </div>
    </div>
  );
}

export default DataTablePage;