import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// A new, more robust data processing function
const processData = (incidents, category) => {
  // This object will store our counts, e.g., { "USA": 20, "UK": 10 }
  const counts = {};

  // Loop through every incident
  for (const incident of incidents) {
    let key = 'Unknown'; // Default key if data is missing
    const value = incident[category];

    // This block determines the key based on the selected category
    if (category === 'year' && incident.event_date) {
      const date = new Date(String(incident.event_date).replace(' ', 'T'));
      if (!isNaN(date.getTime())) {
        key = date.getFullYear();
      }
    } else if (category === 'system_age_yr' && typeof value === 'number') {
      if (value < 1) key = "0-1 Years";
      else if (value >= 1 && value < 3) key = "1-2 Years";
      else if (value >= 3 && value < 5) key = "3-4 Years";
      else key = "5+ Years";
    } else if (category === 'capacity_mw' && typeof value === 'number') {
      const band = Math.floor(value / 10) * 10;
      key = `${band} - ${band + 10} MW`;
    } else if (category === 'capacity_mwh' && typeof value === 'number') {
      const band = Math.floor(value / 100) * 100;
      key = `${band} - ${band + 100} MWh`;
    } else if (value) {
      // This handles all other text-based categories like 'country'
      key = value;
    }
    
    // Increment the count for the determined key
    counts[key] = (counts[key] || 0) + 1;
  }

  // Convert the counts object into an array for the chart
  const processedData = Object.entries(counts).map(([name, value]) => ({ name, incidents: value }));

  // Sort the data correctly
  if (['year', 'capacity_mw', 'capacity_mwh', 'system_age_yr'].includes(category)) {
    // Sort numeric/banded categories by their name/band
    processedData.sort((a, b) => parseFloat(a.name) - parseFloat(b.name));
  } else {
    // Sort text categories by the number of incidents
    processedData.sort((a, b) => b.incidents - a.incidents);
  }

  return processedData;
};

function DashboardPage({ incidents }) {
  const [category, setCategory] = useState('country');
  
  // The full list of options for the user to choose from
  const options = [
    'country', 'year', 'capacity_mw', 'capacity_mwh', 'system_age_yr', 
    'battery_modules', 'integrator', 'enclosure_type', 
    'state_during_accident', 'installation', 'application', 'root_cause'
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