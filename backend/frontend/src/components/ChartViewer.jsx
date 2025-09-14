import React, { useEffect, useState } from 'react';
import API from '../api';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend);


const COLORS = [
  "#4dc9f6", "#f67019", "#f53794", "#537bc4", "#acc236",
  "#166a8f", "#00a950", "#58595b", "#8549ba", "#ffa600",
  "#ff6361", "#bc5090", "#58508d", "#003f5c", "#7a5195"
];
function aggregateData(rows, labelCol, valueCol) {
  const groups = {};
  rows.forEach(row => {
    const label = row[labelCol] || 'N/A';
    const value = valueCol ? parseFloat(row[valueCol]) || 0 : 1;
    groups[label] = (groups[label] || 0) + value;
  });
  return {
    labels: Object.keys(groups),
    data: Object.values(groups)
  };
}

export default function ChartViewer({ sheetId }) {
  const [sheet, setSheet] = useState(null);
  const [labelCol, setLabelCol] = useState('');
  const [valueCol, setValueCol] = useState('');
  const [chartType, setChartType] = useState('bar');

  useEffect(() => {
    if (!sheetId) {
      setSheet(null);
      return;
    }
    API.get(`${sheetId}/`).then(res => {
      setSheet(res.data);
      setLabelCol(res.data.data.columns[0] || '');
      setValueCol(res.data.data.columns.length > 1 ? res.data.data.columns[1] : '');
    }).catch(console.error);
  }, [sheetId]);

  if (!sheet) return <div>Select a sheet to view chart.</div>;

  const { labels, data } = aggregateData(sheet.data.rows, labelCol, (valueCol !== labelCol) ? valueCol : null);

  const chartData = {
    labels,
    datasets: [
      {
        label: valueCol || 'Count',
        data,
        backgroundColor: labels.map((_, i) => COLORS[i % COLORS.length]) // Distinct color per label
      }
    ]
  };

  return (
    <div>
      <h3>{sheet.name}</h3>
      <div>
        <label>Label Column:</label>
        <select value={labelCol} onChange={e => setLabelCol(e.target.value)}>
          {sheet.data.columns.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <label>Value Column :</label>
        <select value={valueCol} onChange={e => setValueCol(e.target.value)}>
          <option value="">None (count)</option>
          {sheet.data.columns.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <label>Chart Type:</label>
        <select value={chartType} onChange={e => setChartType(e.target.value)}>
          <option value="bar">Bar</option>
          <option value="pie">Pie</option>
          <option value="line">Line</option>
        </select>
      </div>
      {chartType === 'bar' && <Bar data={chartData} />}
      {chartType === 'pie' && <Pie data={chartData} />}
      {chartType === 'line' && <Line data={chartData} />}
      <h4>Raw Data Preview (first 10 rows)</h4>
      <pre style={{ maxHeight: 200, overflow: 'auto' }}>
        {JSON.stringify(sheet.data.rows.slice(0, 10), null, 2)}
      </pre>
    </div>
  );
}
