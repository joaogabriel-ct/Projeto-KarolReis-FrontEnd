import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { useRouter } from 'next/router';
import { getAPIClient } from "@/pages/api/axios";
import moment from 'moment-timezone';
import 'react-datepicker/dist/react-datepicker.css';
import { Container } from '@/components/container';

export default function ScheduleAppointment() {
  const [sellers, setSellers] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedSeller, setSelectedSeller] = useState(null);  // Inicialmente nulo
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { procedures } = router.query;
  const { procedureNames } = router.query;

  useEffect(() => {
    const fetchSellers = async () => {
      setLoading(true);
      const api = await getAPIClient();
      try {
        const response = await api.get('/seller/', { params: { procedures } });
        setSellers(response.data.results || []);
      } catch (error) {
        console.error('Erro ao buscar vendedores:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSellers();
  }, [procedures]);

  const fetchAvailableTimes = async (sellerId, date) => {
    if (!sellerId || !date) return;
    const api = await getAPIClient();
    const dateString = moment(date).format('YYYY-MM-DD');
    try {
      const response = await api.get(`/availability/${sellerId}/${dateString}/`);
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
    router.push({
      pathname: '/confirmacao',
      query: {
        procedures,
        procedureNames,
        seller: selectedSeller.id,  // Passando o ID da profissional
        sellerName: selectedSeller.name_complete,  // Passando o nome da profissional
        date: selectedDate.toISOString(),
        time: selectedTime
      }
    });
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
      <h1 className="text-2xl text-gray-700 font-bold text-center mb-6">Selecione uma Data e Horário</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Selecione um Vendedor */}
        <div className="w-full">
          <label className="block text-gray-700 font-medium mb-2">Profissional</label>
          <select
            value={selectedSeller ? selectedSeller.id : ''}  // Define o ID da profissional selecionada
            onChange={(e) => {
              const selected = sellers.find(seller => seller.id === parseInt(e.target.value));  // Encontra a profissional pelo ID
              setSelectedSeller(selected);  // Atualiza a profissional selecionada
            }}
            className="block w-full px-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-blue-200"
          >
            <option value="">Escolha sua profissional</option>
            {sellers.map(seller => (
              <option key={seller.id} value={seller.id}>
                {seller.name_complete}
              </option>
            ))}
          </select>
        </div>

        {/* Selecione uma Data */}
        <div className="w-full">
          <label className="block text-gray-700 font-medium mb-2">Selecione uma Data</label>
          <DatePicker
            selected={selectedDate}
            onChange={date => setSelectedDate(date)}  // Atualiza a data selecionada
            dateFormat="dd/MM/yyyy"
            placeholderText="Selecione uma data"
            minDate={new Date()}
            maxDate={new Date(new Date().setMonth(new Date().getMonth() + 2))}  // Limita a data para os próximos 2 meses
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
                className={`px-4 py-2 rounded-lg shadow-md focus:outline-none ${selectedTime === time[0] ? 'bg-blue-600 text-white' : 'bg-white border'
                  }`}
                onClick={() => setSelectedTime(time[0])}  // Atualiza o horário selecionado
              >
                {time[0]}
              </button>
            ))
          ) : (
            <p className="text-gray-500">Nenhum horário disponível para esta data</p>
          )}
        </div>
      </div>

      {/* Botão Próximo */}
      <div className="flex justify-center mt-8">
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded-md shadow-md hover:bg-blue-700 focus:ring focus:ring-blue-200"
          onClick={handleNext}
          disabled={!selectedDate || !selectedTime || !selectedSeller}  // Desabilita o botão se algum campo estiver vazio
        >
          Próximo
        </button>
      </div>
    </Container>
  );
}
