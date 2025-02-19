import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import DatePicker from 'react-datepicker';
import { useSession } from 'next-auth/react';
import Swal from 'sweetalert2';
import { getAPIClient } from "@/pages/api/axios";
import moment from 'moment-timezone';
import 'react-datepicker/dist/react-datepicker.css';
import { Container } from '@/components/container';

// Componente de Registro (Cadastro de Novo Cliente) para uso no modal
function RegisterForm({ onRegisterSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    user: {
      username: '',
      email: '',
      password: '',
    },
    name: '',
    phone_number: '',
    birthday: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('user.')) {
      setFormData({
        ...formData,
        user: {
          ...formData.user,
          [name.split('.')[1]]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const api = await getAPIClient();
      // Utilize o endpoint correto (no exemplo, 'people/lead/')
      const response = await api.post('people/lead/', formData);
      Swal.fire('Sucesso!', 'Lead cadastrado com sucesso!', 'success');
      onRegisterSuccess(response.data);
      // Limpa o formulário após o cadastro (opcional)
      setFormData({
        user: { username: '', email: '', password: '' },
        name: '',
        phone_number: '',
        birthday: '',
      });
    } catch (error) {
      console.error('Erro ao cadastrar lead:', error);
      Swal.fire('Erro!', 'Falha ao cadastrar lead. Verifique os dados.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Campos do Usuário */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Nome de Usuário</label>
        <input
          type="text"
          name="user.username"
          value={formData.user.username}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          name="user.email"
          value={formData.user.email}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Senha</label>
        <input
          type="password"
          name="user.password"
          value={formData.user.password}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
      </div>
      {/* Campos do Lead */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Nome Completo</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Telefone</label>
        <input
          type="text"
          name="phone_number"
          value={formData.phone_number}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Data de Nascimento</label>
        <input
          type="date"
          name="birthday"
          value={formData.birthday}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
      </div>
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded"
          disabled={loading}
        >
          {loading ? 'Cadastrando...' : 'Registrar'}
        </button>
      </div>
    </form>
  );
}

export default function ScheduleAppointment() {
  const { data: session, status } = useSession();
  const [sellers, setSellers] = useState([]);
  const [clients, setClients] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { procedures, procedureNames } = router.query;

  // Estado para controle do modal de cadastro de novo cliente
  const [showModal, setShowModal] = useState(false);

  // Verifica se o usuário é admin a partir da sessão (supondo que a propriedade esteja em session.isAdmin)
  const isAdmin = session?.isAdmin;

  // Busca dos vendedores
  useEffect(() => {
    const fetchSellers = async () => {
      setLoading(true);
      const api = await getAPIClient();
      try {
        const response = await api.get('people/sellers/', { params: { procedures } });
        setSellers(response.data.results || []);
      } catch (error) {
        console.error('Erro ao buscar vendedores:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSellers();
  }, [procedures]);

  // Busca dos clientes (apenas para admin)
  useEffect(() => {
    if (isAdmin) {
      const fetchClients = async () => {
        const api = await getAPIClient();
        try {
          const response = await api.get('people/lead/');
          setClients(response.data.results || []);
        } catch (error) {
          console.error('Erro ao buscar clientes:', error);
        }
      };
      fetchClients();
    }
  }, [isAdmin]);

  const fetchAvailableTimes = async (sellerId, date) => {
    if (!sellerId || !date) return;
    const api = await getAPIClient();
    const dateString = moment(date).format('YYYY-MM-DD');
    try {
      const response = await api.get(`sales/availability/${sellerId}/${dateString}/`);
      setAvailableTimes(response.data.available_times || []);
    } catch (error) {
      console.error('Erro ao buscar horários disponíveis:', error);
    }
  };

  useEffect(() => {
    if (selectedSeller && selectedDate) {
      fetchAvailableTimes(selectedSeller.id, selectedDate);
    }
  }, [selectedSeller, selectedDate]);

  const handleNext = () => {
    const query = {
      procedures,
      procedureNames,
      seller: selectedSeller.id,
      sellerName: selectedSeller.name_complete,
      date: selectedDate.toISOString(),
      time: selectedTime,
    };

    // Se for admin e um cliente foi selecionado, envia os dados do cliente
    if (isAdmin && selectedClient) {
      query.clientId = selectedClient.id;
      query.clientName = selectedClient.name;
      query.clientCPF = selectedClient.cpf;
      query.clientPhone = selectedClient.phone_number;
    } else {
      // Se não for admin, usa o id do próprio usuário logado (por exemplo, lead_id ou id)
      if (session && session.user) {
        query.clientId = session.user.lead_id || session.user.id;
        query.clientName = session.user.name;
      }
    }

    router.push({
      pathname: '/confirmacao',
      query,
    });
  };

  // Callback para receber o novo cliente cadastrado no modal
  const handleRegisterSuccess = (newClient) => {
    setClients(prev => [...prev, newClient]);
    setSelectedClient(newClient);
    setShowModal(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-blue-400 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <Container>
      <h1 className="text-2xl text-gray-700 font-bold text-center mb-6">
        Selecione uma Data e Horário
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Selecione um Vendedor */}
        <div className="w-full">
          <label className="block text-gray-700 font-medium mb-2">Profissional</label>
          <select
            value={selectedSeller ? selectedSeller.id : ''}
            onChange={(e) => {
              const selected = sellers.find(
                (seller) => seller.id === parseInt(e.target.value)
              );
              setSelectedSeller(selected);
            }}
            className="block w-full px-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-blue-200"
          >
            <option value="">Escolha seu profissional</option>
            {sellers.map((seller) => (
              <option key={seller.id} value={seller.id}>
                {seller.name_complete}
              </option>
            ))}
          </select>
        </div>
        {/* Se o usuário for admin, exibe campo para selecionar o cliente */}
        {isAdmin && (
          <div className="w-full">
            <label className="block text-gray-700 font-medium mb-2">Cliente</label>
            <select
              value={selectedClient ? selectedClient.id : ''}
              onChange={(e) => {
                const selected = clients.find(
                  (client) => client.id === parseInt(e.target.value)
                );
                setSelectedClient(selected);
              }}
              className="block w-full px-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-blue-200"
            >
              <option value="">Escolha o cliente</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="mt-2 px-4 py-2 bg-green-500 text-white rounded"
            >
              Cadastrar novo cliente
            </button>
          </div>
        )}
        {/* Selecione uma Data */}
        <div className="w-full">
          <label className="block text-gray-700 font-medium mb-2">Selecione uma Data</label>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="dd/MM/yyyy"
            placeholderText="Selecione uma data"
            minDate={new Date()}
            maxDate={new Date(new Date().setMonth(new Date().getMonth() + 2))}
            className="block w-full px-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-blue-200"
          />
        </div>
      </div>
      {/* Horários Disponíveis */}
      <div className="mt-6">
        <h2 className="block text-gray-700 font-medium mb-2">Horários Disponíveis</h2>
        <div className="flex flex-wrap justify-center gap-2">
          {availableTimes.length > 0 ? (
            availableTimes.map((time, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded-lg shadow-md focus:outline-none ${
                  selectedTime === time[0] ? 'bg-blue-600 text-white' : 'bg-white border'
                }`}
                onClick={() => setSelectedTime(time[0])}
              >
                {time[0]}
              </button>
            ))
          ) : (
            <p className="text-gray-500">
              Nenhum horário disponível para esta data
            </p>
          )}
        </div>
      </div>
      {/* Botão Próximo */}
      <div className="flex justify-center mt-8">
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded-md shadow-md hover:bg-blue-700 focus:ring focus:ring-blue-200"
          onClick={handleNext}
          disabled={!selectedDate || !selectedTime || !selectedSeller || (isAdmin && !selectedClient)}
        >
          Próximo
        </button>
      </div>
      {/* Modal para cadastrar novo cliente */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl mb-4">Cadastrar Novo Cliente</h2>
            <RegisterForm onRegisterSuccess={handleRegisterSuccess} onCancel={() => setShowModal(false)} />
          </div>
        </div>
      )}
    </Container>
  );
}
