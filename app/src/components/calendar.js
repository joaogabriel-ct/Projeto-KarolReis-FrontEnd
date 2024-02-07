import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'moment/locale/pt-br';
import { AppointmentDetailsModal } from './appointmentDetailsModel';

moment.locale('pt-br');
const localizer = momentLocalizer(moment);

const App = () => {
  const [events, setEvents] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8000/api/v1/agenda/')
      .then(response => {
        const appointments = response.data.map(appointment => ({
          ...appointment,
          start: new Date(appointment.date + 'T' + appointment.time),
          end: new Date(appointment.date + 'T' + appointment.time),
          title: `${appointment.PROCEDURE.name} - ${appointment.LEAD.name}`,
        }));
        setEvents(appointments);
      })
      .catch(error => {
        console.error('Erro ao buscar agendamentos:', error);
      });
  }, []);

  const handleEventClick = (event) => {
    setSelectedAppointment(event);
  };

  return (
    <div className="App" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', height: '100vh', margin: '25px', padding: '25px', backgroundColor: 'white' }}>
      <div style={{ flexGrow: 1 }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          onSelectEvent={handleEventClick}
          style={{ height: 500 }} // Defina uma altura fixa para teste
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
