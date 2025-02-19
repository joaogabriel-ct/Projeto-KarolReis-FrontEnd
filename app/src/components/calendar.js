import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction'; // Mantém o plugin para interação com os eventos
import moment from 'moment';
import 'moment/locale/pt-br';
import { AppointmentDetailsModal } from './appointmentDetailsModel';
import { getAPIClient } from "@/pages/api/axios";

moment.locale('pt-br');

const App = () => {
  const { data: session } = useSession();  // Usando o hook para pegar a sessão
  const [allEvents, setAllEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);  // Estado para armazenar se o usuário é admin

  // Função para buscar eventos da API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const api = await getAPIClient();
      api.get('sales/agenda/')
        .then(response => {
          const appointments = response.data.map(appointment => ({
            id: appointment.id,
            title: appointment.titulo,
            start: new Date(appointment.data_init),
            end: new Date(appointment.data_end),
            seller: appointment.seller_id,
            LEAD: appointment.LEAD,
            SELLER: appointment.SELLER,
            procedures: appointment.procedures || [],
            backgroundColor: getEventColor(appointment.seller_id)
          }));
          setAllEvents(appointments);
          setFilteredEvents(appointments);
        })
        .catch(error => {
          console.error('Erro ao buscar agendamentos:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    };

    // Verifica se o usuário é admin a partir da sessão
    const checkAdminStatus = () => {
      if (session && session.user) {
        const adminStatus = session.user.isAdmin; // Supondo que "isAdmin" esteja dentro de session.user
        setIsAdmin(adminStatus);
      }
    };

    fetchData();
    checkAdminStatus();  // Chama a função para verificar se o usuário é admin
  }, [session]);  // Rodar o useEffect novamente se a sessão mudar

  // Função para definir a cor do evento com base no vendedor
  const getEventColor = (seller) => {
    switch (seller) {
      case 'Joao Gabriel':
        return '#ff0000'; // Vermelho
      case 'Karol Reis':
        return '#00ff00'; // Verde
      default:
        return '#0000ff'; // Azul
    }
  };

  // Filtrar eventos com base no vendedor selecionado
  useEffect(() => {
    const filtered = allEvents.filter(event => !selectedSeller || event.seller === selectedSeller);
    setFilteredEvents(filtered);
  }, [selectedSeller, allEvents]);

  // Função para lidar com o clique no evento
  const handleEventClick = (clickInfo) => {
    const appointment = {
      id: clickInfo.event.id,
      title: clickInfo.event.title,
      start: clickInfo.event.start,
      end: clickInfo.event.end,
      seller: clickInfo.event.extendedProps.seller,
      procedures: clickInfo.event.extendedProps.procedures || [],
      LEAD: clickInfo.event.extendedProps.LEAD || {},
      SELLER: clickInfo.event.extendedProps.SELLER || {},
    };
    setSelectedAppointment(appointment);
  };

  // Handler para troca de vendedor
  const handleSellerChange = (e) => {
    setSelectedSeller(e.target.value);
  };

  return (
    <div className="flex flex-col h-screen justify-center items-center">
      {isAdmin && (
        <>
      <select className="m-4 p-2 w-full" onChange={handleSellerChange}>
        <option value="">Todos os vendedores</option>
        <option value="Joao Gabriel">Joao Gabriel</option>
        <option value="Karol Reis">Karol Reis</option>
      </select>
      </>
      )}

      {loading ? (
        <div className="flex justify-center items-center">
          <p>Carregando eventos...</p>
        </div>
      ) : (
        <div className="flex-grow max-h-80vh overflow-y-auto w-full">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}  // Mantém apenas os plugins necessários
            initialView="dayGridMonth"  // Definindo a visualização inicial como 'Mês'
            locale="pt-br"
            events={filteredEvents}
            eventClick={handleEventClick}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: ''  // Remove outras opções de visualização
            }}
            buttonText={{
              today: 'Hoje',
              month: 'Mês',
            }}
            height="auto"
          />
        </div>
      )}

      {selectedAppointment && (
        <AppointmentDetailsModal
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
          isAdmin={isAdmin}  // Passa o estado de admin para o modal
        />
      )}
    </div>
  );
};

export default App;
