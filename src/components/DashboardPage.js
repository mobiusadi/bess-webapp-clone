import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
  Treemap 
} from 'recharts';

// This helper function processes data into countable categories
const processData = (incidents, category) => {
  const ageBandOrder = ["Less than 1 Year", "1 to 2 Years", "3 to 4 Years", "5+ Years", "Unknown"];
  const counts = incidents.reduce((acc, incident) => {
    let key = 'Unknown';
    const value = incident[category];
    if (category === 'year' && incident.event_date) {
      const date = new Date(String(incident.event_date).replace(' ', 'T'));
      if (!isNaN(date.getTime())) key = date.getFullYear();
    } else if (category === 'system_age_yr' && typeof value === 'number') {
      if (value < 1) key = "Less than 1 Year";
      else if (value >= 1 && value < 3) key = "1 to 2 Years";
      else if (value >= 3 && value < 5) key = "3 to 4 Years";
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

  // The 'value' for Bar/Pie charts, and 'size' for Treemap
  const processedData = Object.entries(counts).map(([name, count]) => ({ name, value: count, size: count }));

  if (category === 'system_age_yr') {
    processedData.sort((a, b) => ageBandOrder.indexOf(a.name) - ageBandOrder.indexOf(b.name));
  } else if (['capacity_mw', 'capacity_mwh', 'year'].includes(category)) {
    processedData.sort((a, b) => parseFloat(a.name) - parseFloat(b.name));
  } else {
    processedData.sort((a, b) => b.value - a.value);
  }
  return processedData;
};

// A custom component to render the content of each Treemap box
const CustomizedTreemapContent = ({ root, depth, x, y, width, height, index, colors, name, value }) => (
    <g>
      <rect x={x} y={y} width={width} height={height} style={{ fill: colors[index % colors.length], stroke: '#fff', strokeWidth: 2 }} />
      {width > 80 && height > 25 && (
        <text x={x + width / 2} y={y + height / 2 + 7} textAnchor="middle" fill="#fff" fontSize={14}>
          {name}
        </text>
      )}
    </g>
);

function DashboardPage({ incidents }) {
  const [barChartCategory, setBarChartCategory] = useState('country');
  const [pieChartCategory, setPieChartCategory] = useState('battery_modules');
  const [treemapCategory, setTreemapCategory] = useState('root_cause');

  const barChartData = useMemo(() => processData(incidents, barChartCategory), [incidents, barChartCategory]);
  const pieChartData = useMemo(() => processData(incidents, pieChartCategory), [incidents, pieChartCategory]);
  const treemapData = useMemo(() => processData(incidents, treemapCategory), [incidents, treemapCategory]);
  
  const allOptions = ['country', 'year', 'capacity_mw', 'capacity_mwh', 'system_age_yr', 'battery_modules', 'integrator', 'enclosure_type', 'state_during_accident', 'installation', 'application', 'root_cause'];
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF42A2'];

  return (
    <div className="dashboard-page">
      <h2>Incident Dashboard</h2>

      {/* Bar Chart Section */}
      <div className="chart-section">
        <h3>Incidents by Category (Bar Chart)</h3>
        <div className="dashboard-controls">
          <label>Select Category:</label>
          <select value={barChartCategory} onChange={(e) => setBarChartCategory(e.target.value)}>
            {allOptions.map(o => <option key={o} value={o}>{o.replace(/_/g, ' ').toUpperCase()}</option>)}
          </select>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={barChartData} margin={{ top: 5, right: 20, left: 10, bottom: 75 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} height={100}/>
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" name="Incidents" fill="#dc3545" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart Section */}
      <div className="chart-section">
        <h3>Proportional Breakdown (Donut Chart)</h3>
        <div className="dashboard-controls">
          <label>Select Category:</label>
          <select value={pieChartCategory} onChange={(e) => setPieChartCategory(e.target.value)}>
            {allOptions.map(o => <option key={o} value={o}>{o.replace(/_/g, ' ').toUpperCase()}</option>)}
          </select>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie 
              data={pieChartData} 
              dataKey="value" 
              nameKey="name" 
              cx="50%" 
              cy="50%" 
              innerRadius={70}
              outerRadius={140}
              fill="#8884d8"
              labelLine={({ name, percent }) => (percent > 0.02)}
              label={({ name, percent }) => (percent > 0.02 ? `${name}` : '')}
            >
              {pieChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
            </Pie>
            <Tooltip formatter={(value) => `${value} incidents`} />
            <Legend formatter={(value, entry) => {
                const { color } = entry;
                const total = pieChartData.reduce((sum, item) => sum + item.value, 0);
                const percent = (entry.payload.value / total * 100).toFixed(0);
                return <span style={{ color }}>{value} ({percent}%)</span>;
            }}/>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Treemap Section */}
      <div className="chart-section">
        <h3>Category Treemap</h3>
        <div className="dashboard-controls">
            <label>Select Category:</label>
            <select value={treemapCategory} onChange={(e) => setTreemapCategory(e.target.value)}>
              {allOptions.map(o => <option key={o} value={o}>{o.replace(/_/g, ' ').toUpperCase()}</option>)}
            </select>
        </div>
        <ResponsiveContainer width="100%" height={400}>
            <Treemap 
                data={treemapData} 
                dataKey="size" 
                ratio={4 / 3} 
                stroke="#fff" 
                fill="#8884d8"
                content={<CustomizedTreemapContent colors={COLORS} />}
            >
              {/* THIS IS THE FIX: The Tooltip must be a direct child of the chart component */}
              <Tooltip />
            </Treemap>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default DashboardPage;