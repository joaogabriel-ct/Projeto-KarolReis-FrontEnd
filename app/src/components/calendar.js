import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import moment from 'moment';
import 'moment/locale/pt-br';
import { AppointmentDetailsModal } from './appointmentDetailsModel';
import { getAPIClient } from "@/pages/api/axios";
import TestAPI from './TestAPI';

moment.locale('pt-br');

const GoogleCalendarIntegration = () => {
  const { data: session } = useSession();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const [selectedView, setSelectedView] = useState('dayGridMonth');
  const [selectedSeller, setSelectedSeller] = useState('');
  const [showGoogleEvents, setShowGoogleEvents] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/backend/v1';

  // Buscar todos os eventos (locais + Google)
  const fetchAllEvents = async () => {
    setLoading(true);
    try {
      const api = await getAPIClient();
      
      // Buscar agendamentos locais
      console.log('Buscando agendamentos...');
      console.log('Token de autenticação:', session?.accessToken ? 'Presente' : 'Ausente');
      const localResponse = await api.get('agenda/');
      console.log('Resposta da API:', localResponse.data);
      const localEvents = localResponse.data;

      // Buscar eventos do Google Calendar
      let googleEvents = [];
      if (showGoogleEvents && isGoogleConnected) {
        try {
          const googleResponse = await api.get('calendar/google/events/');
          googleEvents = googleResponse.data;
        } catch (error) {
          console.log('Google Calendar não disponível:', error.message);
        }
      }

      // Formatar eventos locais
      const formattedLocalEvents = localEvents.map(appointment => ({
        id: `local-${appointment.id}`,
        title: appointment.titulo || 'Agendamento',
        start: new Date(appointment.data_init),
        end: new Date(appointment.data_end),
        backgroundColor: getEventColor(appointment.seller_id),
        borderColor: getEventColor(appointment.seller_id),
        extendedProps: {
          type: 'local',
          seller: appointment.seller_id,
          lead: appointment.LEAD,
          sellerInfo: appointment.SELLER,
          procedures: appointment.procedures || [],
          originalId: appointment.id
        }
      }));

      // Formatar eventos do Google
      const formattedGoogleEvents = googleEvents.map(event => ({
        id: `google-${event.id}`,
        title: event.summary || 'Evento Google',
        start: new Date(event.start?.dateTime || event.start?.date),
        end: new Date(event.end?.dateTime || event.end?.date),
        backgroundColor: '#4285f4',
        borderColor: '#4285f4',
        extendedProps: {
          type: 'google',
          description: event.description,
          location: event.location
        }
      }));

      // Combinar eventos
      const allEvents = [...formattedLocalEvents, ...formattedGoogleEvents];
      
      // Filtrar por vendedor se selecionado
      const filteredEvents = selectedSeller 
        ? allEvents.filter(event => event.extendedProps?.seller === selectedSeller)
        : allEvents;

      setEvents(filteredEvents);
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Função para definir cor do evento
  const getEventColor = (seller) => {
    switch (seller) {
      case 'Joao Gabriel':
        return '#ff0000';
      case 'Karol Reis':
        return '#00ff00';
      default:
        return '#0000ff';
    }
  };

  // Conectar com Google Calendar
  const connectGoogleCalendar = async () => {
    try {
      const api = await getAPIClient();
      const response = await api.get('calendar/google/auth/');
      
      if (response.data.auth_url) {
        window.location.href = response.data.auth_url;
      }
    } catch (error) {
      console.error('Erro ao conectar Google Calendar:', error);
      alert('Erro ao conectar com Google Calendar');
    }
  };

  // Criar novo agendamento
  const createAppointment = async (appointmentData) => {
    try {
      const api = await getAPIClient();
      const response = await api.post('agenda/', appointmentData);

      // Se Google está conectado, sincronizar
      if (isGoogleConnected) {
        try {
          await api.post('calendar/google/events/create/', {
            summary: appointmentData.titulo || 'Agendamento',
            description: `Agendamento com ${appointmentData.seller_id}`,
            start: {
              dateTime: new Date(`${appointmentData.date}T${appointmentData.time}`).toISOString(),
              timeZone: 'America/Sao_Paulo'
            },
            end: {
              dateTime: new Date(`${appointmentData.date}T${appointmentData.time}`).toISOString(),
              timeZone: 'America/Sao_Paulo'
            }
          });
        } catch (error) {
          console.log('Erro ao sincronizar com Google:', error);
        }
      }

      // Recarregar eventos
      await fetchAllEvents();
      return response.data;
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      throw error;
    }
  };

  // Verificar disponibilidade
  const checkAvailability = async (sellerId, date) => {
    try {
      const api = await getAPIClient();
      const response = await api.get(`sales/availability/${sellerId}/${date}/`);
      return response.data;
    } catch (error) {
      console.error('Erro ao verificar disponibilidade:', error);
      return [];
    }
  };

  // Handler para clique no evento
  const handleEventClick = (clickInfo) => {
    const event = clickInfo.event;
    
    // Usar o ID original do agendamento se disponível, senão extrair do ID do evento
    const realId = event.extendedProps.originalId || event.id.replace(/^(local-|google-)/, '');
    console.log('Evento clicado:', event);
    console.log('ID real do agendamento:', realId);
    
    const eventData = {
      id: realId,
      title: event.title,
      start: event.start,
      end: event.end,
      type: event.extendedProps.type,
      seller: event.extendedProps.seller,
      procedures: event.extendedProps.procedures || [],
      LEAD: event.extendedProps.lead || {},
      SELLER: event.extendedProps.sellerInfo || {},
      ...event.extendedProps
    };

    // Se for evento local, mostrar modal de detalhes
    if (eventData.type === 'local') {
      setSelectedAppointment(eventData);
    } else {
      // Se for evento do Google, mostrar alerta simples
      alert(`
        Evento: ${eventData.title}
        Início: ${moment(eventData.start).format('DD/MM/YYYY HH:mm')}
        Fim: ${moment(eventData.end).format('DD/MM/YYYY HH:mm')}
        Tipo: Google Calendar
        ${eventData.description ? `Descrição: ${eventData.description}` : ''}
        ${eventData.location ? `Local: ${eventData.location}` : ''}
      `);
    }
  };

  // Handler para seleção de data
  const handleDateSelect = (selectInfo) => {
    const title = prompt('Digite o título do agendamento:');
    if (title) {
      const seller = prompt('Digite o vendedor (Joao Gabriel/Karol Reis):');
      if (seller) {
        const appointmentData = {
          titulo: title,
          seller_id: seller,
          data_init: selectInfo.startStr,
          data_end: selectInfo.endStr,
          status: 'agendado'
        };

        createAppointment(appointmentData)
          .then(() => {
            alert('Agendamento criado com sucesso!');
          })
          .catch(error => {
            alert('Erro ao criar agendamento: ' + error.message);
          });
      }
    }
  };

  // Carregar eventos quando componente montar
  useEffect(() => {
    if (session?.accessToken) {
      fetchAllEvents();
    }
  }, [session, selectedSeller, showGoogleEvents]);

  // Verificar se Google está conectado
  useEffect(() => {
    const checkGoogleConnection = async () => {
      try {
        const api = await getAPIClient();
        await api.get('calendar/google/events/');
        setIsGoogleConnected(true);
      } catch (error) {
        setIsGoogleConnected(false);
      }
    };

    if (session?.accessToken) {
      checkGoogleConnection();
    }
  }, [session]);

  // Verificar se o usuário é admin
  useEffect(() => {
    if (session && session.user) {
      const adminStatus = session.user.isAdmin;
      setIsAdmin(adminStatus);
    }
  }, [session]);

  return (
    <div className="flex flex-col h-screen justify-center items-center">
      {/* Componente de teste temporário */}
      <div className="mb-6 w-full max-w-6xl">
        <TestAPI />
      </div>
      
      {/* Header com controles */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow w-full max-w-6xl">
        <h1 className="text-2xl font-bold mb-4">📅 Calendário Integrado</h1>
        
        <div className="flex flex-wrap gap-4 items-center">
          {/* Status do Google Calendar */}
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${isGoogleConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <span className="text-sm">
              Google Calendar: {isGoogleConnected ? 'Conectado' : 'Desconectado'}
            </span>
          </div>

          {/* Botão de conexão */}
          {!isGoogleConnected && (
            <button
              onClick={connectGoogleCalendar}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              🔗 Conectar Google Calendar
            </button>
          )}

          {/* Filtro por vendedor (apenas para admin) */}
          {isAdmin && (
            <select
              value={selectedSeller}
              onChange={(e) => setSelectedSeller(e.target.value)}
              className="border rounded px-3 py-2"
            >
              <option value="">Todos os vendedores</option>
              <option value="Joao Gabriel">Joao Gabriel</option>
              <option value="Karol Reis">Karol Reis</option>
            </select>
          )}

          {/* Visualização */}
          <select
            value={selectedView}
            onChange={(e) => setSelectedView(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="dayGridMonth">Mês</option>
            <option value="timeGridWeek">Semana</option>
            <option value="timeGridDay">Dia</option>
          </select>

          {/* Toggle Google Events */}
          {isGoogleConnected && (
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showGoogleEvents}
                onChange={(e) => setShowGoogleEvents(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Mostrar eventos do Google</span>
            </label>
          )}

          {/* Botão de recarregar */}
          <button
            onClick={fetchAllEvents}
            disabled={loading}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 disabled:opacity-50"
          >
            {loading ? '🔄 Carregando...' : '🔄 Recarregar'}
          </button>
        </div>
      </div>

      {/* Calendário */}
      <div className="bg-white rounded-lg shadow p-4 w-full max-w-6xl">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p>Carregando eventos...</p>
            </div>
          </div>
        ) : (
          <div className="flex-grow max-h-80vh overflow-y-auto w-full">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView={selectedView}
              locale="pt-br"
              events={events}
              eventClick={handleEventClick}
              selectable={true}
              select={handleDateSelect}
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
              }}
              buttonText={{
                today: 'Hoje',
                month: 'Mês',
                week: 'Semana',
                day: 'Dia'
              }}
              height="auto"
              eventDisplay="block"
              eventTimeFormat={{
                hour: '2-digit',
                minute: '2-digit',
                meridiem: false
              }}
              slotMinTime="08:00:00"
              slotMaxTime="20:00:00"
              allDaySlot={false}
              slotDuration="00:30:00"
              slotLabelFormat={{
                hour: '2-digit',
                minute: '2-digit',
                meridiem: false
              }}
              selectMirror={true}
              dayMaxEvents={true}
              weekends={true}
            />
          </div>
        )}
      </div>

      {/* Legenda */}
      <div className="mt-4 bg-white rounded-lg shadow p-4 w-full max-w-6xl">
        <h3 className="font-bold mb-2">Legenda:</h3>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span>Joao Gabriel</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span>Karol Reis</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span>Outros vendedores</span>
          </div>
          {isGoogleConnected && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded border-2 border-blue-700"></div>
              <span>Google Calendar</span>
            </div>
          )}
        </div>
      </div>

      {/* Modal de detalhes do agendamento */}
      {selectedAppointment && (
        <AppointmentDetailsModal
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
          isAdmin={isAdmin}
        />
      )}
    </div>
  );
};

export default GoogleCalendarIntegration;
