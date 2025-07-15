import React, { useState, useMemo } from 'react';
import { Bar, Doughnut, Radar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {
  Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, RadialLinearScale, PointElement, LineElement, Filler, Title, Tooltip, Legend,
} from 'chart.js';

ChartJS.register(
  ArcElement, CategoryScale, LinearScale, BarElement, RadialLinearScale, PointElement, LineElement, Filler, Title, Tooltip, Legend, ChartDataLabels
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
  
  if (['year', 'system_age_yr', 'capacity_mw', 'capacity_mwh'].includes(category)) {
    processedData.sort((a, b) => parseFloat(a.name) - parseFloat(b.name));
  } else {
    processedData.sort((a, b) => b.incidents - a.incidents);
  }
  return processedData;
};

function DashboardPage({ incidents }) {
  const [barCategory, setBarCategory] = useState('country');
  const [donutCategory, setDonutCategory] = useState('battery_modules');
  const [radarCategory, setRadarCategory] = useState('root_cause');

  const barChartData = useMemo(() => processData(incidents, barCategory), [incidents, barCategory]);
  const donutChartData = useMemo(() => processData(incidents, donutCategory), [incidents, donutCategory]);
  const radarChartData = useMemo(() => processData(incidents, radarCategory), [incidents, radarCategory]);

  // --- THIS IS THE FIX ---
  // The full, comprehensive list of categories for the dropdowns.
  const allOptions = [
    'country', 'year', 'capacity_mw', 'capacity_mwh', 'system_age_yr', 
    'battery_modules', 'integrator', 'enclosure_type', 
    'state_during_accident', 'installation', 'application', 'root_cause'
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#DC3545', '#8E44AD'];

  const dataForBarChart = {
    labels: barChartData.map(d => d.name),
    datasets: [{
      label: '# of Incidents',
      data: barChartData.map(d => d.incidents),
      backgroundColor: 'rgba(220, 53, 69, 0.7)',
    }],
  };
  
  const dataForDonutChart = {
    labels: donutChartData.map(d => d.name),
    datasets: [{
      data: donutChartData.map(d => d.incidents),
      backgroundColor: COLORS,
    }],
  };
  
  const dataForRadarChart = {
    labels: radarChartData.map(d => d.name),
    datasets: [{
      label: '# of Incidents',
      data: radarChartData.map(d => d.incidents),
      backgroundColor: 'rgba(220, 53, 69, 0.2)',
      borderColor: 'rgba(220, 53, 69, 1)',
      borderWidth: 2,
    }],
  };

  const barChartOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { y: { ticks: { autoSkip: false } }, x: { beginAtZero: true, ticks: { precision: 0 } } }
  };
  
  const donutOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
          legend: { position: 'right' }
      }
  };

  return (
    <div className="dashboard-page">
      <h2>Incident Dashboard</h2>
      
      <div className="chart-section">
        <h3>Incidents by Category</h3>
        <div className="dashboard-controls">
          <label>Select Category:</label>
          <select value={barCategory} onChange={(e) => setBarCategory(e.target.value)}>
            {allOptions.map(o => <option key={o} value={o}>{o.replace(/_/g, ' ').toUpperCase()}</option>)}
          </select>
        </div>
        <div className="chart-container">
          <Bar options={barChartOptions} data={dataForBarChart} />
        </div>
      </div>

      <div className="chart-grid">
        <div className="chart-section">
          <h3>Proportional Breakdown (Donut)</h3>
          <div className="dashboard-controls">
            <label>Select Category:</label>
            <select value={donutCategory} onChange={(e) => setDonutCategory(e.target.value)}>
              {allOptions.map(o => <option key={o} value={o}>{o.replace(/_/g, ' ').toUpperCase()}</option>)}
            </select>
          </div>
          <div className="chart-container" style={{height: '60vh'}}>
            <Doughnut options={donutOptions} data={dataForDonutChart} />
          </div>
        </div>
        
        <div className="chart-section">
          <h3>Category Comparison (Radar)</h3>
           <div className="dashboard-controls">
            <label>Select Category:</label>
            <select value={radarCategory} onChange={(e) => setRadarCategory(e.target.value)}>
              {allOptions.map(o => <option key={o} value={o}>{o.replace(/_/g, ' ').toUpperCase()}</option>)}
            </select>
          </div>
          <div className="chart-container" style={{height: '60vh'}}>
            <Radar data={dataForRadarChart} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;