import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { apiService } from '@/utils/apiService';
import { useNotifications } from '@/components/NotificationSystem';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Scheduling = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { showSuccess, showError } = useNotifications();
  
  const [sellers, setSellers] = useState([]);
  const [clients, setClients] = useState([]);
  const [procedures, setProcedures] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedProcedures, setSelectedProcedures] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [loading, setLoading] = useState(true);
  const [calendarLoading, setCalendarLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  const { procedures: queryProcedures, procedureNames } = router.query;
  const isAdmin = session?.isAdmin || session?.user?.isAdmin;

  // Buscar vendedores
  useEffect(() => {
    const fetchSellers = async () => {
      setLoading(true);
      try {
        const response = await apiService.getSellers();
        setSellers(response.results || response);
      } catch (error) {
        console.error('Erro ao buscar vendedores:', error);
        showError('Erro ao carregar profissionais');
      } finally {
        setLoading(false);
      }
    };
    fetchSellers();
  }, []);

  // Buscar procedimentos
  useEffect(() => {
    const fetchProcedures = async () => {
      try {
        const response = await apiService.getProcedures();
        setProcedures(response.results || response);
      } catch (error) {
        console.error('Erro ao buscar procedimentos:', error);
        showError('Erro ao carregar procedimentos');
      }
    };
    fetchProcedures();
  }, []);

  // Buscar clientes (apenas para admin)
  useEffect(() => {
    if (isAdmin) {
      const fetchClients = async () => {
        try {
          const response = await apiService.getLeads();
          setClients(response.results || response);
        } catch (error) {
          console.error('Erro ao buscar clientes:', error);
        }
      };
      fetchClients();
    }
  }, [isAdmin]);

  // Buscar horários disponíveis
  const fetchAvailableTimes = async (sellerId, date) => {
    if (!sellerId || !date) return;
    
    try {
      setCalendarLoading(true);
      const dateString = date.toISOString().split('T')[0];
      const response = await apiService.checkAvailability(sellerId, dateString);
      setAvailableTimes(response.available_times || []);
    } catch (error) {
      console.error('Erro ao buscar horários disponíveis:', error);
      showError('Erro ao buscar horários disponíveis');
    } finally {
      setCalendarLoading(false);
    }
  };

  useEffect(() => {
    if (selectedSeller && selectedDate) {
      fetchAvailableTimes(selectedSeller.id, selectedDate);
    }
  }, [selectedSeller, selectedDate]);

  // Função para lidar com seleção de procedimentos
  const handleProcedureToggle = (procedureId) => {
    setSelectedProcedures(prev => {
      if (prev.includes(procedureId)) {
        return prev.filter(id => id !== procedureId);
      } else {
        return [...prev, procedureId];
      }
    });
  };

  // Criar agendamento local (sem Google Calendar por enquanto)
  const createLocalAppointment = async (appointmentData) => {
    try {
      setCalendarLoading(true);
      
      const startDateTime = new Date(appointmentData.date);
      const [hours, minutes] = appointmentData.time.split(':');
      startDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      
      const endDateTime = new Date(startDateTime);
      endDateTime.setHours(endDateTime.getHours() + 1);

      // Criar agendamento local
      const appointmentPayload = {
        lead_id: appointmentData.clientId,
        seller_id: appointmentData.seller,
        data_init: startDateTime.toISOString(),
        titulo: `Agendamento - ${appointmentData.procedureNames || 'Procedimentos selecionados'}`,
        status: 'agendado',
        procedure_ids: appointmentData.procedures || selectedProcedures
      };

      const response = await apiService.createAppointment(appointmentPayload);
      return response;
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      throw error;
    } finally {
      setCalendarLoading(false);
    }
  };

  const handleNext = async () => {
    try {
      // Obter nomes dos procedimentos selecionados
      const selectedProcedureNames = procedures
        .filter(proc => selectedProcedures.includes(proc.id))
        .map(proc => proc.name)
        .join(', ');

      const appointmentData = {
        procedures: selectedProcedures,
        procedureNames: selectedProcedureNames || queryProcedures || 'Procedimentos selecionados',
        seller: selectedSeller.id,
        sellerName: selectedSeller.name_complete,
        date: selectedDate.toISOString(),
        time: selectedTime,
      };

      // Se for admin e um cliente foi selecionado, envia os dados do cliente
      if (isAdmin && selectedClient) {
        appointmentData.clientId = selectedClient.id;
        appointmentData.clientName = selectedClient.name;
        appointmentData.clientCPF = selectedClient.cpf;
        appointmentData.clientPhone = selectedClient.phone_number;
      } else {
        // Se não for admin, usa o id do próprio usuário logado
        if (session && session.user) {
          appointmentData.clientId = session.user.lead_id || session.user.id;
          appointmentData.clientName = session.user.name;
        }
      }

      // Create local appointment
      await createLocalAppointment(appointmentData);

      // Proceed to confirmation page
      router.push({
        pathname: '/confirmacao',
        query: appointmentData,
      });
    } catch (error) {
      showError('Ocorreu um erro ao criar o agendamento. Por favor, tente novamente.');
    }
  };

  // Callback para receber o novo cliente cadastrado no modal
  const handleRegisterSuccess = (newClient) => {
    setClients(prev => [...prev, newClient]);
    setSelectedClient(newClient);
    setShowModal(false);
  };

  // Redirecionar se não houver sessão
  if (!session?.accessToken) {
    router.push('/login');
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Agendar Horário</h1>
          <p className="mt-2 text-gray-600">
            Selecione o profissional, data e horário para seu agendamento
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Selecione um Vendedor */}
            <div className="w-full">
              <label className="block text-gray-700 font-medium mb-2">
                Profissional *
              </label>
              <select
                value={selectedSeller ? selectedSeller.id : ''}
                onChange={(e) => {
                  const selected = sellers.find(
                    (seller) => seller.id === parseInt(e.target.value)
                  );
                  setSelectedSeller(selected);
                }}
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                <label className="block text-gray-700 font-medium mb-2">
                  Cliente *
                </label>
                <select
                  value={selectedClient ? selectedClient.id : ''}
                  onChange={(e) => {
                    const selected = clients.find(
                      (client) => client.id === parseInt(e.target.value)
                    );
                    setSelectedClient(selected);
                  }}
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                >
                  Cadastrar novo cliente
                </button>
              </div>
            )}
          </div>

          {/* Selecione os Procedimentos */}
           <div className="mt-6">
             <label className="block text-gray-700 font-medium mb-2">
               Procedimentos *
             </label>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
               {procedures.map((procedure) => (
                 <div
                   key={procedure.id}
                   className={`p-3 border rounded-lg cursor-pointer transition-all ${
                     selectedProcedures.includes(procedure.id)
                       ? 'border-blue-500 bg-blue-50'
                       : 'border-gray-300 hover:border-gray-400'
                   }`}
                   onClick={() => handleProcedureToggle(procedure.id)}
                 >
                   <div className="flex items-center justify-between">
                     <div>
                       <h4 className="font-medium text-gray-900">{procedure.name}</h4>
                       <p className="text-sm text-gray-600">
                         R$ {typeof procedure.value === 'number' ? procedure.value.toFixed(2) : '0.00'}
                       </p>
                       {procedure.duration && (
                         <p className="text-xs text-gray-500">
                           {procedure.duration} min
                         </p>
                       )}
                     </div>
                     <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                       selectedProcedures.includes(procedure.id)
                         ? 'border-blue-500 bg-blue-500'
                         : 'border-gray-300'
                     }`}>
                       {selectedProcedures.includes(procedure.id) && (
                         <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                           <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                         </svg>
                       )}
                     </div>
                   </div>
                 </div>
               ))}
             </div>
             {selectedProcedures.length === 0 && (
               <p className="text-sm text-red-600 mt-2">
                 Selecione pelo menos um procedimento
               </p>
             )}
           </div>

           {/* Selecione uma Data */}
           <div className="mt-6">
             <label className="block text-gray-700 font-medium mb-2">
               Selecione uma Data *
             </label>
             <DatePicker
               selected={selectedDate}
               onChange={(date) => setSelectedDate(date)}
               dateFormat="dd/MM/yyyy"
               placeholderText="Selecione uma data"
               minDate={new Date()}
               maxDate={new Date(new Date().setMonth(new Date().getMonth() + 2))}
               className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
             />
           </div>

                      {/* Horários Disponíveis */}
           <div className="mt-6">
             <h2 className="block text-gray-700 font-medium mb-2">
               Horários Disponíveis
             </h2>
             
             {calendarLoading ? (
               <div className="flex items-center justify-center py-8">
                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                 <span className="ml-2 text-gray-600">Buscando horários...</span>
               </div>
             ) : availableTimes.length > 0 ? (
               <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                 {availableTimes.map((time, index) => (
                   <button
                     key={index}
                     className={`px-4 py-3 rounded-lg shadow-md focus:outline-none transition-all ${
                       selectedTime === time[0] 
                         ? 'bg-blue-600 text-white shadow-lg transform scale-105' 
                         : 'bg-white border border-gray-300 hover:bg-gray-50 hover:border-blue-300'
                     }`}
                     onClick={() => setSelectedTime(time[0])}
                   >
                     {time[0]}
                   </button>
                 ))}
               </div>
             ) : selectedDate ? (
               <div className="text-center py-8">
                 <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                 </svg>
                 <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum horário disponível</h3>
                 <p className="mt-1 text-sm text-gray-500">
                   Não há horários disponíveis para esta data.
                 </p>
               </div>
             ) : (
               <div className="text-center py-8">
                 <p className="text-gray-500">
                   Selecione um profissional e uma data para ver os horários disponíveis.
                 </p>
               </div>
             )}
           </div>

                                {/* Informações do Agendamento */}
           {selectedSeller && selectedDate && selectedTime && selectedProcedures.length > 0 && (
             <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
               <h3 className="text-lg font-medium text-blue-900 mb-2">
                 Resumo do Agendamento
               </h3>
               <div className="space-y-1 text-sm text-blue-800">
                 <p><strong>Profissional:</strong> {selectedSeller.name_complete}</p>
                 <p><strong>Data:</strong> {selectedDate.toLocaleDateString('pt-BR')}</p>
                 <p><strong>Horário:</strong> {selectedTime}</p>
                 <p><strong>Procedimentos:</strong> {procedures.filter(proc => selectedProcedures.includes(proc.id)).map(proc => proc.name).join(', ')}</p>
                 <p><strong>Valor Total:</strong> R$ {procedures.filter(proc => selectedProcedures.includes(proc.id)).reduce((total, proc) => total + (typeof proc.value === 'number' ? proc.value : 0), 0).toFixed(2)}</p>
               </div>
             </div>
           )}

                     {/* Botão Próximo */}
           <div className="flex justify-center mt-8">
             <button
               className={`px-8 py-3 rounded-md shadow-md transition-all ${
                 !selectedDate || !selectedTime || !selectedSeller || selectedProcedures.length === 0 || (isAdmin && !selectedClient) || calendarLoading
                   ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                   : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg transform hover:scale-105'
               }`}
               onClick={handleNext}
               disabled={!selectedDate || !selectedTime || !selectedSeller || selectedProcedures.length === 0 || (isAdmin && !selectedClient) || calendarLoading}
             >
               {calendarLoading ? 'Criando agendamento...' : 'Confirmar Agendamento'}
             </button>
           </div>
        </div>

        {/* Modal para cadastrar novo cliente */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-96 max-w-md">
              <h2 className="text-xl font-semibold mb-4">Cadastrar Novo Cliente</h2>
              <RegisterForm onRegisterSuccess={handleRegisterSuccess} onCancel={() => setShowModal(false)} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

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
      const response = await apiService.createLead(formData);
      showSuccess('Lead cadastrado com sucesso!');
      onRegisterSuccess(response);
      setFormData({
        user: { username: '', email: '', password: '' },
        name: '',
        phone_number: '',
        birthday: '',
      });
    } catch (error) {
      console.error('Erro ao cadastrar lead:', error);
      showError('Falha ao cadastrar lead. Verifique os dados.');
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
          className="w-full p-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
          className="w-full p-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
          className="w-full p-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
          className="w-full p-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
          className="w-full p-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
          className="w-full p-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Cadastrando...' : 'Registrar'}
        </button>
      </div>
    </form>
  );
}

export default Scheduling; 