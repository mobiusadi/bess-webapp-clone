import React from 'react';
import PivotTableUI from 'react-pivottable/PivotTableUI';
import 'react-pivottable/pivottable.css';
import TableRenderers from 'react-pivottable/TableRenderers';
import Plot from 'react-plotly.js';
import createPlotlyRenderers from 'react-pivottable/PlotlyRenderers';

// Create Plotly renderers
const PlotlyRenderers = createPlotlyRenderers(Plot);

function PivotTableView({ incidents }) {
    const [pivotState, setPivotState] = React.useState({});
    return (
        <div className="page-container">
            <h2>Pivot Table Explorer</h2>
            <p>Drag and drop attributes to build your own analysis.</p>
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