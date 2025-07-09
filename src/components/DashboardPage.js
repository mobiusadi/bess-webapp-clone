import React, { useState, useMemo } from 'react';
import { Bar, Doughnut, PolarArea } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {
  Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, RadialLinearScale, Title, Tooltip, Legend,
} from 'chart.js';

// Register all the components and plugins Chart.js will use
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, RadialLinearScale, Title, Tooltip, Legend, ChartDataLabels);

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
  const [barCategory, setBarCategory] = useState('country');
  const [donutCategory, setDonutCategory] = useState('battery_modules');
  const [polarCategory, setPolarCategory] = useState('root_cause');

  const barChartData = useMemo(() => processData(incidents, barCategory), [incidents, barCategory]);
  const donutChartData = useMemo(() => processData(incidents, donutCategory), [incidents, donutCategory]);
  const polarChartData = useMemo(() => processData(incidents, polarCategory), [incidents, polarCategory]);

  const allOptions = ['country', 'year', 'system_age_yr', 'battery_modules', 'root_cause', 'installation'];
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#DC3545', '#8E44AD'];

  // --- Chart.js Data and Options objects ---
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
  
  const dataForPolarAreaChart = {
    labels: polarChartData.map(d => d.name),
    datasets: [{
      data: polarChartData.map(d => d.incidents),
      backgroundColor: COLORS,
    }],
  };

  const commonChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      datalabels: {
        color: '#fff',
        font: { weight: 'bold' },
        formatter: (value) => value > 1 ? value : '', // Only show label if count > 1
      }
    },
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
          <Bar options={{...commonChartOptions, indexAxis: 'y', plugins: {legend: {display: false}}}} data={dataForBarChart} />
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
            <Doughnut options={commonChartOptions} data={dataForDonutChart} />
          </div>
        </div>
        
        <div className="chart-section">
          <h3>Proportional Breakdown (Polar Area)</h3>
           <div className="dashboard-controls">
            <label>Select Category:</label>
            <select value={polarCategory} onChange={(e) => setPolarCategory(e.target.value)}>
              {allOptions.map(o => <option key={o} value={o}>{o.replace(/_/g, ' ').toUpperCase()}</option>)}
            </select>
          </div>
          <div className="chart-container" style={{height: '60vh'}}>
            <PolarArea options={commonChartOptions} data={dataForPolarAreaChart} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;