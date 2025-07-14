import React, { useState, useMemo } from 'react';
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const processData = (incidents, category) => {
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
    } else if (category === 'capacity_mw' && typeof value === 'number') {
      const band = Math.floor(value / 10) * 10;
      key = `${band} - ${band + 10} MW`;
    } else if (category === 'capacity_mwh' && typeof value === 'number') {
      const band = Math.floor(value / 100) * 100;
      key = `${band} - ${band + 100} MWh`;
    } else if (value) {
      key = value;
    }
    
    acc[String(key)] = (acc[String(key)] || 0) + 1;
    return acc;
  }, {});

  const processedData = Object.entries(counts).map(([name, value]) => ({ name, incidents: value }));
  
  if (['year', 'capacity_mw', 'capacity_mwh', 'system_age_yr'].includes(category)) {
    processedData.sort((a, b) => parseFloat(a.name) - parseFloat(b.name));
  } else {
    processedData.sort((a, b) => b.incidents - a.incidents);
  }
  return processedData;
};

function DashboardPage({ incidents }) {
  const [category, setCategory] = useState('country');

  // --- THIS IS THE FIX ---
  // The full list of categories you can analyze.
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

  const dataForChart = {
    labels: chartData.map(d => d.name),
    datasets: [
      {
        label: '# of Incidents',
        data: chartData.map(d => d.incidents),
        backgroundColor: 'rgba(220, 53, 69, 0.7)',
        borderColor: 'rgba(220, 53, 69, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: `Incidents by ${category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}`,
      },
    },
    scales: {
        y: {
            ticks: {
                autoSkip: false,
            }
        },
        x: {
            beginAtZero: true,
            ticks: {
                precision: 0
            }
        }
    }
  };

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
      <div className="chart-container">
        <Bar options={chartOptions} data={dataForChart} />
      </div>
    </div>
  );
}

export default DashboardPage;