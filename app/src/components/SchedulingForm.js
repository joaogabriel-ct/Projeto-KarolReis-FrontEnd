import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/backend/v1';

const SchedulingForm = ({ onSubmit, selectedDate, selectedTime }) => {
  const [sellers, setSellers] = useState([]);
  const [procedures, setProcedures] = useState([]);
  const [clients, setClients] = useState([]);
  const [selectedSeller, setSelectedSeller] = useState('');
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedProcedures, setSelectedProcedures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSellers();
    fetchProcedures();
    fetchClients();
  }, []);

  const fetchSellers = async () => {
    try {
      const response = await axios.get(`${API_URL}/people/sellers/`);
      setSellers(response.data);
    } catch (err) {
      setError('Erro ao carregar vendedores');
      console.error(err);
    }
  };

  const fetchProcedures = async () => {
    try {
      const response = await axios.get(`${API_URL}/operation/procedures/`);
      setProcedures(response.data);
    } catch (err) {
      setError('Erro ao carregar procedimentos');
      console.error(err);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await axios.get(`${API_URL}/people/leads/`);
      setClients(response.data);
    } catch (err) {
      setError('Erro ao carregar clientes');
      console.error(err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedSeller || !selectedClient || selectedProcedures.length === 0) {
      setError('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    const appointmentData = {
      seller_id: selectedSeller,
      lead_id: selectedClient,
      procedure_ids: selectedProcedures,
      data_init: `${selectedDate}T${selectedTime[0]}`,
      data_end: `${selectedDate}T${selectedTime[1]}`,
      titulo: `Agendamento - ${clients.find(c => c.id === selectedClient)?.name}`
    };

    onSubmit(appointmentData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Vendedor *
        </label>
        <select
          value={selectedSeller}
          onChange={(e) => setSelectedSeller(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
          required
        >
          <option value="">Selecione um vendedor</option>
          {sellers.map((seller) => (
            <option key={seller.id} value={seller.id}>
              {seller.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Cliente *
        </label>
        <select
          value={selectedClient}
          onChange={(e) => setSelectedClient(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
          required
        >
          <option value="">Selecione um cliente</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Procedimentos *
        </label>
        <div className="mt-2 space-y-2">
          {procedures.map((procedure) => (
            <div key={procedure.id} className="flex items-center">
              <input
                type="checkbox"
                id={`procedure-${procedure.id}`}
                value={procedure.id}
                checked={selectedProcedures.includes(procedure.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedProcedures([...selectedProcedures, procedure.id]);
                  } else {
                    setSelectedProcedures(
                      selectedProcedures.filter((id) => id !== procedure.id)
                    );
                  }
                }}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor={`procedure-${procedure.id}`}
                className="ml-2 block text-sm text-gray-900"
              >
                {procedure.name} - R$ {procedure.value}
              </label>
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        {loading ? 'Agendando...' : 'Agendar'}
      </button>
    </form>
  );
};

export default SchedulingForm; 