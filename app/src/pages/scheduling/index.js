import React, { useState, useEffect } from 'react';
import { schedulingService } from '../../utils/schedulingService';
import { Calendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../../styles/calendar.css';
import { format, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import SchedulingForm from '../../components/SchedulingForm';
import TimeSlotSelector from '../../components/TimeSlotSelector';
import toast from 'react-hot-toast';

const SchedulingPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchAppointments();
    fetchEvents();
  }, [selectedDate]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await schedulingService.getAppointments({
        data_init: format(selectedDate, "yyyy-MM-dd'T'HH:mm:ssXXX")
      });
      setAppointments(data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar agendamentos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const data = await schedulingService.googleCalendar.getEvents();
      setEvents(data);
    } catch (err) {
      console.error('Erro ao carregar eventos:', err);
    }
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const hasEvents = events.some(event => {
        const eventDate = new Date(event.start.dateTime);
        return isSameDay(eventDate, date);
      });
      
      if (hasEvents) {
        return (
          <div className="event-indicator"></div>
        );
      }
    }
    return null;
  };

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const hasEvents = events.some(event => {
        const eventDate = new Date(event.start.dateTime);
        return isSameDay(eventDate, date);
      });
      
      if (hasEvents) {
        return 'has-events';
      }
    }
    return null;
  };

  const handleDateChange = async (date) => {
    setSelectedDate(date);
    setSelectedTime(null);
    setShowForm(false);
    if (selectedSeller) {
      try {
        const availability = await schedulingService.checkAvailability(
          selectedSeller.id,
          format(date, 'yyyy-MM-dd')
        );
        setAvailableTimes(availability.available_times);
      } catch (err) {
        setError('Erro ao verificar disponibilidade');
        console.error(err);
      }
    }
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setShowForm(true);
  };

  const handleCreateAppointment = async (appointmentData) => {
    try {
      setLoading(true);
      await schedulingService.createAppointment(appointmentData);
      await fetchAppointments();
      await fetchEvents();
      setShowForm(false);
      setSelectedTime(null);
      setError(null);
      toast.success('Agendamento criado com sucesso!');
    } catch (err) {
      setError('Erro ao criar agendamento');
      console.error(err);
      toast.error('Erro ao criar agendamento');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAppointment = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este agendamento?')) {
      try {
        setLoading(true);
        await schedulingService.deleteAppointment(id);
        await fetchAppointments();
        await fetchEvents();
        toast.success('Agendamento excluído com sucesso!');
      } catch (err) {
        setError('Erro ao excluir agendamento');
        console.error(err);
        toast.error('Erro ao excluir agendamento');
      } finally {
        setLoading(false);
      }
    }
  };

  const getDayEvents = () => {
    return events.filter(event => {
      const eventDate = new Date(event.start.dateTime);
      return isSameDay(eventDate, selectedDate);
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Agendamento</h1>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Calendário</h2>
          <div className="calendar-container">
            <Calendar
              onChange={handleDateChange}
              value={selectedDate}
              locale="pt-BR"
              className="border rounded-lg shadow-sm bg-white"
              tileContent={tileContent}
              tileClassName={tileClassName}
            />
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Horários Disponíveis</h2>
          <TimeSlotSelector
            availableTimes={availableTimes}
            selectedTime={selectedTime}
            onTimeSelect={handleTimeSelect}
            loading={loading}
          />

          {showForm && selectedTime && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Preencher Agendamento</h3>
              <SchedulingForm
                onSubmit={handleCreateAppointment}
                selectedDate={format(selectedDate, 'yyyy-MM-dd')}
                selectedTime={selectedTime}
              />
            </div>
          )}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Agendamentos do Dia</h2>
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Carregando...</span>
          </div>
        ) : (
          <div className="grid gap-4">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="border rounded-lg p-4 shadow-sm bg-white"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">{appointment.titulo}</h3>
                    <p className="text-gray-600">Vendedor: {appointment.SELLER?.name}</p>
                    <p className="text-gray-600">Cliente: {appointment.LEAD?.name}</p>
                    <p className="text-gray-600">Horário: {format(new Date(appointment.data_init), 'HH:mm')} - {format(new Date(appointment.data_end), 'HH:mm')}</p>
                    <div className="mt-2">
                      <h4 className="font-medium text-gray-900">Procedimentos:</h4>
                      <ul className="list-disc list-inside text-gray-600">
                        {appointment.procedures.map((procedure, index) => (
                          <li key={index}>{procedure}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteAppointment(appointment.id)}
                    className="text-red-500 hover:text-red-700 font-medium"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {getDayEvents().length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Eventos do Google Calendar</h2>
          <div className="grid gap-4">
            {getDayEvents().map((event) => (
              <div
                key={event.id}
                className="border rounded-lg p-4 shadow-sm bg-blue-50 border-blue-200"
              >
                <h3 className="font-semibold text-blue-900">{event.summary}</h3>
                <p className="text-sm text-blue-700">
                  {format(new Date(event.start.dateTime), 'dd/MM/yyyy HH:mm')} - {format(new Date(event.end.dateTime), 'HH:mm')}
                </p>
                {event.description && (
                  <p className="mt-2 text-sm text-blue-600">{event.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SchedulingPage; 