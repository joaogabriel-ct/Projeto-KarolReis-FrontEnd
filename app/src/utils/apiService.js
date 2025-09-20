import axios from 'axios';
import { getSession } from 'next-auth/react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/backend/v1';

class ApiService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
    });

    this.setupInterceptors();
  }

  setupInterceptors() {
    // Request interceptor
    this.api.interceptors.request.use(
      async (config) => {
        const session = await getSession();
        if (session?.accessToken) {
          config.headers.Authorization = `Bearer ${session.accessToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401 && !error.config._retry) {
          error.config._retry = true;
          
          try {
            const session = await getSession();
            const refreshResponse = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
              refresh: session?.refreshToken
            });
            
            const newToken = refreshResponse.data.access;
            this.api.defaults.headers.Authorization = `Bearer ${newToken}`;
            
            return this.api(error.config);
          } catch (refreshError) {
            // Redirect to login if refresh fails
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(credentials) {
    const response = await this.api.post('/auth/login/', credentials);
    return response.data;
  }

  async register(userData) {
    const response = await this.api.post('/auth/register/', userData);
    return response.data;
  }

  // People endpoints
  async getLeads() {
    const response = await this.api.get('/people/lead/');
    return response.data;
  }

  async createLead(leadData) {
    const response = await this.api.post('/people/lead/', leadData);
    return response.data;
  }

  async updateLead(id, leadData) {
    const response = await this.api.put(`/people/lead/${id}/`, leadData);
    return response.data;
  }

  async deleteLead(id) {
    const response = await this.api.delete(`/people/lead/${id}/`);
    return response.data;
  }

  async getSellers() {
    const response = await this.api.get('/people/sellers/');
    return response.data;
  }

  async createSeller(sellerData) {
    const response = await this.api.post('/people/sellers/', sellerData);
    return response.data;
  }

  // Sales endpoints
  async getSales() {
    const response = await this.api.get('/sales/sales/');
    return response.data;
  }

  async createSale(saleData) {
    const response = await this.api.post('/sales/sales/', saleData);
    return response.data;
  }

  async updateSale(id, saleData) {
    const response = await this.api.put(`/sales/sales/${id}/`, saleData);
    return response.data;
  }

  async deleteSale(id) {
    const response = await this.api.delete(`/sales/sales/${id}/`);
    return response.data;
  }

  async getAppointments() {
    const response = await this.api.get('/sales/agenda/');
    return response.data;
  }

  async createAppointment(appointmentData) {
    const response = await this.api.post('/sales/agenda/', appointmentData);
    return response.data;
  }

  async updateAppointment(id, appointmentData) {
    const response = await this.api.put(`/sales/agendamento/${id}/`, appointmentData);
    return response.data;
  }

  async deleteAppointment(id) {
    const response = await this.api.delete(`/sales/agendamento/${id}/`);
    return response.data;
  }

  async checkAvailability(sellerId, date) {
    const response = await this.api.get(`/sales/availability/${sellerId}/${date}/`);
    return response.data;
  }

  // Google Calendar sync endpoints
  async syncGoogleCalendar(appointmentId = null) {
    const data = appointmentId ? { appointment_id: appointmentId } : {};
    const response = await this.api.post('/sales/sync-google-calendar/', data);
    return response.data;
  }

  // Google Calendar events
  async getGoogleCalendarEvents(timeMin = null, timeMax = null, maxResults = 20) {
    const params = new URLSearchParams();
    if (timeMin) params.append('timeMin', timeMin);
    if (timeMax) params.append('timeMax', timeMax);
    params.append('maxResults', maxResults);
    
    const response = await this.api.get(`/calendar/google/events/?${params}`);
    return response.data;
  }

  async createGoogleCalendarEvent(eventData) {
    const response = await this.api.post('/calendar/google/events/create/', eventData);
    return response.data;
  }

  async deleteGoogleCalendarEvent(eventId) {
    const response = await this.api.delete(`/calendar/google/events/${eventId}/`);
    return response.data;
  }

  // Operations endpoints
  async getProcedures() {
    const response = await this.api.get('/operation/procedure/');
    return response.data;
  }

  async createProcedure(procedureData) {
    const response = await this.api.post('/operation/procedure/', procedureData);
    return response.data;
  }

  async updateProcedure(id, procedureData) {
    const response = await this.api.put(`/operation/procedure/${id}/`, procedureData);
    return response.data;
  }

  async deleteProcedure(id) {
    const response = await this.api.delete(`/operation/procedure/${id}/`);
    return response.data;
  }

  // Calendar endpoints
  async getCalendarEvents() {
    const response = await this.api.get('/calendar/events/local/');
    return response.data;
  }

  async createCalendarEvent(eventData) {
    // Usar a view que cria eventos no Google Calendar
    const response = await this.api.post('/calendar/google/events/create/', eventData);
    return response.data;
  }

  async updateCalendarEvent(id, eventData) {
    const response = await this.api.put(`/calendar/events/local/${id}/`, eventData);
    return response.data;
  }

  async deleteCalendarEvent(id) {
    const response = await this.api.delete(`/calendar/events/local/${id}/`);
    return response.data;
  }

  // Dashboard statistics
  async getDashboardStats() {
    const response = await this.api.get('/sales/dashboard-stats/');
    return response.data;
  }

  async getRecentAppointments() {
    const response = await this.api.get('/sales/recent-appointments/');
    return response.data;
  }

  // Chart endpoints
  async getWeeklyAppointments() {
    const response = await this.api.get('/sales/weekly-appointments/');
    return response.data;
  }

  async getAppointmentTypes() {
    const response = await this.api.get('/sales/appointment-types/');
    return response.data;
  }

  async getRevenueTrend() {
    const response = await this.api.get('/sales/revenue-trend/');
    return response.data;
  }

}

export const apiService = new ApiService();
export default apiService; 