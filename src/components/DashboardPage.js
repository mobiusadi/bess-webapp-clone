import React, { useState, useMemo, useEffect } from 'react';
// THIS IS THE FIX: We only import the 'Bar' component that we are actually using.
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register only the components needed for the Bar chart
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Helper function to check for modern browser features
const isModernBrowser = () => {
    try {
        const canvas = document.createElement('canvas');
        return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
        return false;
    }
};

const processData = (incidents, category) => {
  // ... (the existing processData function is correct and remains here) ...
  const counts = incidents.reduce((acc, incident) => {
    let key = 'Unknown';
    const value = incident[category];
    if (category === 'year' && incident.event_date) {
      const date = new Date(String(incident.event_date).replace(' ', 'T'));
      key = !isNaN(date.getTime()) ? date.getFullYear() : 'Unknown';
    } else if (category === 'system_age_yr' && typeof value === 'number') {
      if (value < 1) key = "0-1 Years";
      else if (value >= 1 && value < 3) key = "1-2 Years";
      else if (value >= 3 && value < 5) key = "3-4 Years";
      else key = "5+ Years";
    } else if (value) {
      key = value;
    }
    acc[String(key)] = (acc[String(key)] || 0) + 1;
    return acc;
  }, {});
  const processedData = Object.entries(counts).map(([name, value]) => ({ name, incidents: value }));
  if (['year', 'system_age_yr'].includes(category)) {
    processedData.sort((a, b) => parseFloat(a.name) - parseFloat(b.name));
  } else {
    processedData.sort((a, b) => b.incidents - a.incidents);
  }
  return processedData;
};

function DashboardPage({ incidents }) {
  const [browserIsModern, setBrowserIsModern] = useState(true);

  useEffect(() => {
    setBrowserIsModern(isModernBrowser());
  }, []);
  
  const [barCategory, setBarCategory] = useState('country');
  const barChartData = useMemo(() => processData(incidents, barCategory), [incidents, barCategory]);
  const dataForBarChart = {
      labels: barChartData.map(d => d.name),
      datasets: [{
          label: '# of Incidents',
          data: barChartData.map(d => d.incidents),
          backgroundColor: 'rgba(220, 53, 69, 0.7)',
      }],
  };
  const barChartOptions = {
      indexAxis: 'y', responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } }
  };

  // If it's an old browser, render a simple fallback.
  if (!browserIsModern) {
    return (
      <div className="page-container">
        <h2>Dashboard</h2>
        <p>Interactive charts are not supported on this browser version.</p>
      </div>
    );
  }

  // If it's a modern browser, render the full interactive dashboard.
  return (
    <div className="dashboard-page">
      <h2>Incident Dashboard</h2>
      <div className="chart-section">
        <h3>Incidents by Category</h3>
        <div className="dashboard-controls">
          <label>Select Category:</label>
          <select value={barCategory} onChange={(e) => setBarCategory(e.target.value)}>
            <option value="country">Country</option>
            <option value="year">Year</option>
            <option value="battery_modules">Battery</option>
          </select>
        </div>
        <div className="chart-container">
          <Bar options={barChartOptions} data={dataForBarChart} />
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;