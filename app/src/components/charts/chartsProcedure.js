import React from 'react';
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

// Registra os componentes necessários
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

const GraficoProcedimentosMaisVendidos = ({ dados }) => {
  const data = {
    labels: dados.map(d => d.nome),
    datasets: [
      {
        label: 'Vendas',
        data: dados.map(d => d.vendas),
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  return <Bar options={options} data={data} />;
};

export default GraficoProcedimentosMaisVendidos;
