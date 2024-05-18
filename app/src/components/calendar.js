import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'moment/locale/pt-br';
import { AppointmentDetailsModal } from './appointmentDetailsModel';
import { api } from '@/service/api';

moment.locale('pt-br');
const localizer = momentLocalizer(moment);

const App = () => {
  const [allEvents, setAllEvents] = useState([]); // Lista de todos os eventos não filtrados
  const [filteredEvents, setFilteredEvents] = useState([]); // Lista de eventos filtrados
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedSeller, setSelectedSeller] = useState(null);

  useEffect(() => {
    api.get('http://localhost:8000/api/v1/agenda/')
      .then(response => {
        const appointments = response.data.map(appointment => ({
          ...appointment,
          start: new Date(appointment.date + 'T' + appointment.time),
          end: new Date(appointment.date + 'T' + appointment.time),
          title: `${appointment.PROCEDURE.name} - ${appointment.LEAD.name}`,
          seller: appointment.SELLER.name_complete
        }));
        setAllEvents(appointments);
        setFilteredEvents(appointments); // Define os eventos filtrados inicialmente como todos os eventos
      })
      .catch(error => {
        console.error('Erro ao buscar agendamentos:', error);
      });
  }, []);

  useEffect(() => {
    // Filtra os eventos com base no vendedor selecionado
    const filteredEvents = allEvents.filter(event => !selectedSeller || event.seller === selectedSeller);
    setFilteredEvents(filteredEvents);
  }, [selectedSeller, allEvents]);

  const handleEventClick = (event) => {
    setSelectedAppointment(event);
  };

  const eventStyleGetter = (event, start, end, isSelected) => {
    let backgroundColor = '';
    switch (event.seller) {
      case 'Joao Gabriel':
        backgroundColor = '#ff0000';
        break;
      case 'Karol':
        backgroundColor = '#00ff00';
        break;
      default:
        backgroundColor = '#0000ff';
        break;
    }
    return {
      style: {
        backgroundColor,
      },
    };
  };

  const handleChange = (e) => {
    setSelectedSeller(e.target.value);
  };

  return (
    <div className="flex flex-col h-screen justify-center items-center">
      <select className="m-4 p-2 w-full" onChange={handleChange}>
        <option value="">Todos os vendedores</option>
        <option value="Joao Gabriel">Joao Gabriel</option>
        <option value="Karol">Karol</option>
      </select>

      <div className="flex-grow max-h-80vh overflow-y-auto">
        <Calendar
          className='mt-4 p-4 bg-white'
          localizer={localizer}
          events={filteredEvents}
          messages={{next: "Próximo", previous: "Anterior", today: "Hoje", month:"Mês", week:"Semana", day: "Dia", date:'Data', time: "Tempo", event:"Evento"}}
          startAccessor="start"
          endAccessor="end"
          onSelectEvent={handleEventClick}
          eventPropGetter={eventStyleGetter}
          style={{ flexGrow: 1 }}
        />
      </div>

      {selectedAppointment && (
        <AppointmentDetailsModal
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
        />
      )}
    </div>
  );
};

export default App;
