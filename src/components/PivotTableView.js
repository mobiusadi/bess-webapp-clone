import React from 'react';
import PivotTableUI from 'react-pivottable/PivotTableUI';
import 'react-pivottable/pivottable.css';
import TableRenderers from 'react-pivottable/TableRenderers';
import Plot from 'react-plotly.js';
import createPlotlyRenderers from 'react-pivottable/PlotlyRenderers';

// Create Plotly chart renderers
const PlotlyRenderers = createPlotlyRenderers(Plot);

function PivotTableView({ incidents }) {
    // We use a simple state hook to hold the pivot table configuration
    const [pivotState, setPivotState] = React.useState({});
    
    return (
        <div className="page-container">
            <h2>Pivot Table Explorer</h2>
            <p>Drag and drop attributes to build your own analysis.</p>
            {/* This component provides the full Excel-like pivot table UI */}
            <PivotTableUI
                data={incidents}
                onChange={s => setPivotState(s)}
                renderers={Object.assign({}, TableRenderers, PlotlyRenderers)}
                {...pivotState}
            />
        </div>
    );
}
export default PivotTableView;