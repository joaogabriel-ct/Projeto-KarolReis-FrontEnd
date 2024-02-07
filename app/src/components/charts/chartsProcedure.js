import React from 'react';
import { Bar } from 'react-chartjs-2'; // Certifique-se de que esta importação está correta
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Registra os componentes necessários do Chart.js
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

// Certifique-se de que os dados passados para o componente estão corretos
const GraficoProcedimentosMaisVendidos = ({ dados }) => {
  const data = {
    labels: dados.map(d => d.nome),
    datasets: [
      {
        label: 'Vendas',
        data: dados.map(d => d.vendas),
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  return <Bar options={options} data={data} />;
};

export default GraficoProcedimentosMaisVendidos;