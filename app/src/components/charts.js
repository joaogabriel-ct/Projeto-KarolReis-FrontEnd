import React from 'react';
import { LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer } from 'recharts';

function createData(time, amount) {
  const date = new Date(time);
  const formattedTime = date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short'
  }).replace(' de ', ' ');
  return { time: formattedTime, amount };
}

export default function Charts({ salesData }) {
    const dataArray = Array.isArray(salesData) ? salesData : [salesData];

  const formattedSalesData = dataArray.map(item =>
    createData(item.date, item.PROCEDURE.value.toFixed(2))
  );
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
          <XAxis dataKey="time" stroke="#4B5563" />
          <YAxis stroke="#4B5563">
            <Label angle={270} position="left" style={{ textAnchor: 'middle', fill: '#1F2937' }}>
              Vendas (R$)
            </Label>
          </YAxis>
          <Line
            isAnimationActive={false}
            type="monotone"
            dataKey="amount"
            stroke="#2563EB" // blue-600
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}