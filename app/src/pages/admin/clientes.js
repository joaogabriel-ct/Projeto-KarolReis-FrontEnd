import React, { useEffect, useState } from 'react';
import AdminLayout from "@/layouts/adminLayout";
import { getAPIClient } from "@/pages/api/axios";
import ClientTable from '@/components/tables/clientTable';
import ClientModal from '@/components/modalCliente';

function Clients() {
  const [data, setData] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Função para buscar os dados da API
  const fetchData = async () => {
    const api = await getAPIClient();
    api.get('people/lead/')
      .then(response => {
        // Utiliza a propriedade "results" para obter o array de clientes
        setData(response.data.results);
      })
      .catch(error => {
        console.error('Erro ao buscar os dados dos clientes:', error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtra os clientes com base no termo de busca
  const filteredData = data.filter((client) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Ao clicar em uma linha da tabela, abre o modal com os dados do cliente
  const handleRowClick = (client) => {
    setSelectedClient(client);
  };

  const closeModal = () => {
    setSelectedClient(null);
  };

  return (
    <div className="container mx-auto px-4 pt-20">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar cliente..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-2"
        />
      </div>
      <div className="overflow-auto" style={{ maxHeight: '400px' }}>
        <ClientTable data={filteredData} onRowClick={handleRowClick} />
      </div>
      {selectedClient && (
        <ClientModal
          client={selectedClient}
          onClose={closeModal}
          onSuccess={fetchData}
        />
      )}
    </div>
  );
}

Clients.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;

export default Clients;
