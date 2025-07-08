import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// This is the final, most robust version of the data processing function
const processData = (incidents, category) => {
  // Define the specific order for our custom age bands
  const ageBandOrder = [
    "Less than 1 Year", "1 to 2 Years", "3 to 4 Years",
    "5+ Years", "Unknown"
  ];

  const counts = incidents.reduce((acc, incident) => {
    let key;
    const value = incident[category];

    // Use a switch statement for clarity to handle each special case
    switch (category) {
      case 'capacity_mw':
        key = (typeof value === 'number' && !isNaN(value))
          ? `${Math.floor(value / 10) * 10} - ${Math.floor(value / 10) * 10 + 10} MW`
          : 'Unknown';
        break;
      case 'capacity_mwh':
        key = (typeof value === 'number' && !isNaN(value))
          ? `${Math.floor(value / 100) * 100} - ${Math.floor(value / 100) * 100 + 100} MWh`
          : 'Unknown';
        break;
      case 'system_age_yr':
        if (typeof value !== 'number' || isNaN(value)) {
          key = 'Unknown';
        } else if (value < 1) {
          key = "Less than 1 Year";
        } else if (value >= 1 && value < 3) {
          key = "1 to 2 Years";
        } else if (value >= 3 && value < 5) {
          key = "3 to 4 Years";
        } else {
          key = "5+ Years";
        }
        break;
      // THIS IS THE FIX: We put the year parsing logic back in
      case 'year':
        const date = incident.event_date ? new Date(String(incident.event_date).replace(' ', 'T')) : null;
        key = (date && !isNaN(date.getTime())) ? date.getFullYear() : 'Unknown';
        break;
      default:
        // This handles all other text categories like 'country' and 'integrator'
        key = value || 'Unknown';
        break;
    }

    acc[String(key)] = (acc[String(key)] || 0) + 1;
    return acc;
  }, {});

  const processedData = Object.entries(counts)
    .map(([name, value]) => ({ name, incidents: value }));
    
  // Sort the data correctly based on the category
  if (category === 'system_age_yr') {
    processedData.sort((a, b) => ageBandOrder.indexOf(a.name) - ageBandOrder.indexOf(b.name));
  } else if (['capacity_mw', 'capacity_mwh', 'year'].includes(category)) {
    processedData.sort((a, b) => parseFloat(a.name) - parseFloat(b.name));
  } else {
    processedData.sort((a, b) => b.incidents - a.incidents);
  }

  return processedData;
};

function DashboardPage({ incidents }) {
  const [category, setCategory] = useState('country');
  
  // NEW: Added all your requested categories to the dropdown options
  const options = [
    'country', 
    'year', 
    'capacity_mw', 
    'capacity_mwh', 
    'system_age_yr', 
    'battery_modules', 
    'integrator',
    'enclosure_type',
    'state_during_accident',
    'installation',
    'application',
    'root_cause'
  ];

  const chartData = useMemo(() => processData(incidents, category), [incidents, category]);

  return (
    <div className="dashboard-page">
      <h2>Incident Dashboard</h2>
      <div className="dashboard-controls">
        <label htmlFor="category-select">Group Incidents By:</label>
        <select 
          id="category-select"
          value={category} 
          onChange={(e) => setCategory(e.target.value)}
        >
          {options.map(option => (
            <option key={option} value={option}>
              {option.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </option>
          ))}
        </select>
      </div>
      <ResponsiveContainer width="95%" height={500}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            angle={-45}
            textAnchor="end"
            interval={0}
            height={120}
          />
          <YAxis allowDecimals={false} label={{ value: 'Number of Incidents', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend verticalAlign="top" />
          <Bar dataKey="incidents" fill="#dc3545" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default DashboardPage;