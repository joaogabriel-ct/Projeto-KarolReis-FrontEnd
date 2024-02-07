import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function createData(time, amount) {
  const date = new Date(time);
  const formattedTime = date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short'
  }).replace(' de ', ' ');
  return { time: formattedTime, amount: parseFloat(amount) };
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip" style={{ backgroundColor: 'white', padding: '10px', border: '1px solid #ddd' }}>
        <p className="label">{`Data: ${label}`}</p>
        <p className="intro">{`Venda: R$ ${payload[0].value}`}</p>
      </div>
    );
  }

  return null;
};

export default function Charts({ salesData }) {
  const dataArray = Array.isArray(salesData) ? salesData : [salesData];
  const formattedSalesData = dataArray.map(item => createData(item.date, item.PROCEDURE.value));

  return (
    <div style={{ width: '100%', height: '300px' }}>
      <ResponsiveContainer>
        <LineChart
          data={formattedSalesData}
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 24,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" stroke="#4B5563" />
          <YAxis stroke="#4B5563" label={{ value: 'Vendas (R$)', angle: -90, position: 'insideLeft', textAnchor: 'middle', fill: '#1F2937' }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            isAnimationActive={false}
            type="monotone"
            dataKey="amount"
            stroke="#2563EB" // blue-600
            dot={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
