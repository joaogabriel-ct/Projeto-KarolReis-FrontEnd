import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/backend/v1';

export const schedulingService = {
  // Get all appointments
  getAppointments: async (params = {}) => {
    const response = await axios.get(`${API_URL}/agenda/`, { params });
    return response.data;
  },

  // Create new appointment
  createAppointment: async (appointmentData) => {
    const response = await axios.post(`${API_URL}/agenda/`, appointmentData);
    
    // Create Google Calendar event
    try {
      await axios.post(`${API_URL}/calendar/google/events/create/`, {
        summary: appointmentData.titulo || 'Agendamento',
        start: {
          dateTime: appointmentData.data_init,
          timeZone: 'America/Sao_Paulo'
        },
        end: {
          dateTime: appointmentData.data_end,
          timeZone: 'America/Sao_Paulo'
        },
        description: `Vendedor: ${appointmentData.seller_id}\nProcedimentos: ${appointmentData.procedure_ids.join(', ')}`
      });
    } catch (error) {
      console.error('Erro ao criar evento no Google Calendar:', error);
    }
    
    return response.data;
  },

  // Get appointment by ID
  getAppointment: async (id) => {
    const response = await axios.get(`${API_URL}/sales/agendamento/${id}/`);
    return response.data;
  },

  // Update appointment
  updateAppointment: async (id, appointmentData) => {
    const response = await axios.put(`${API_URL}/sales/agendamento/${id}/`, appointmentData);
    
    // Update Google Calendar event if it exists
    try {
      const googleEvent = await axios.get(`${API_URL}/calendar/google/events/search/`, {
        params: {
          q: `Agendamento ${id}`
        }
      });
      
      if (googleEvent.data && googleEvent.data.length > 0) {
        await axios.put(`${API_URL}/calendar/google/events/${googleEvent.data[0].id}/`, {
          summary: appointmentData.titulo || 'Agendamento',
          start: {
            dateTime: appointmentData.data_init,
            timeZone: 'America/Sao_Paulo'
          },
          end: {
            dateTime: appointmentData.data_end,
            timeZone: 'America/Sao_Paulo'
          },
          description: `Vendedor: ${appointmentData.seller_id}\nProcedimentos: ${appointmentData.procedure_ids.join(', ')}`
        });
      }
    } catch (error) {
      console.error('Erro ao atualizar evento no Google Calendar:', error);
    }
    
    return response.data;
  },

  // Delete appointment
  deleteAppointment: async (id) => {
    const response = await axios.delete(`${API_URL}/sales/agendamento/${id}/`);
    
    // Delete Google Calendar event if it exists
    try {
      const googleEvent = await axios.get(`${API_URL}/calendar/google/events/search/`, {
        params: {
          q: `Agendamento ${id}`
        }
      });
      
      if (googleEvent.data && googleEvent.data.length > 0) {
        await axios.delete(`${API_URL}/calendar/google/events/${googleEvent.data[0].id}/`);
      }
    } catch (error) {
      console.error('Erro ao deletar evento no Google Calendar:', error);
    }
    
    return response.data;
  },

  // Check availability
  checkAvailability: async (sellerId, date) => {
    const response = await axios.get(`${API_URL}/sales/availability/${sellerId}/${date}/`);
    return response.data;
  },

  // Reschedule appointment
  rescheduleAppointment: async (appointmentId, newDate, newTime) => {
    const response = await axios.post(`${API_URL}/sales/agendamento/remarcar/${appointmentId}/`, {
      date: newDate,
      time: newTime
    });
    
    // Update Google Calendar event if it exists
    try {
      const googleEvent = await axios.get(`${API_URL}/calendar/google/events/search/`, {
        params: {
          q: `Agendamento ${appointmentId}`
        }
      });
      
      if (googleEvent.data && googleEvent.data.length > 0) {
        await axios.put(`${API_URL}/calendar/google/events/${googleEvent.data[0].id}/`, {
          start: {
            dateTime: `${newDate}T${newTime[0]}`,
            timeZone: 'America/Sao_Paulo'
          },
          end: {
            dateTime: `${newDate}T${newTime[1]}`,
            timeZone: 'America/Sao_Paulo'
          }
        });
      }
    } catch (error) {
      console.error('Erro ao atualizar evento no Google Calendar:', error);
    }
    
    return response.data;
  },

  // Google Calendar specific methods
  googleCalendar: {
    // Get Google Calendar events
    getEvents: async () => {
      try {
        const response = await axios.get(`${API_URL}/calendar/google/events/`);
        return response.data;
      } catch (error) {
        console.error('Erro ao buscar eventos:', error);
        return [];
      }
    },

    // Get events for a specific period
    getPeriodEvents: async (days = 7, includeToday = true) => {
      try {
        const response = await axios.get(`${API_URL}/calendar/google/events/period/`, {
          params: {
            days,
            include_today: includeToday ? 1 : 0,
            singleEvents: true,
            orderBy: 'startTime'
          }
        });
        return response.data;
      } catch (error) {
        console.error('Erro ao buscar eventos do período:', error);
        return [];
      }
    },

    // Get available calendar colors
    getColors: async () => {
      const response = await axios.get(`${API_URL}/calendar/google/colors/`);
      return response.data;
    }
  }
}; 