import React, { useState } from 'react';
import { apiService } from '../utils/apiService';

const GoogleCalendarSync = ({ appointmentId = null, onSyncComplete }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSync = async () => {
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await apiService.syncGoogleCalendar(appointmentId);
      
      if (response.success) {
        setMessage(response.message);
        if (onSyncComplete) {
          onSyncComplete(response);
        }
      } else {
        setError(response.message || 'Erro na sincronização');
      }
    } catch (err) {
      setError('Erro ao sincronizar com Google Calendar');
      console.error('Erro na sincronização:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">
        {appointmentId ? 'Sincronizar Agendamento' : 'Sincronizar Todos os Agendamentos'}
      </h3>
      
      {appointmentId ? (
        <p className="text-sm text-gray-600 mb-4">
          Sincronizar agendamento ID: {appointmentId} com Google Calendar
        </p>
      ) : (
        <p className="text-sm text-gray-600 mb-4">
          Sincronizar todos os agendamentos que ainda não foram sincronizados com Google Calendar
        </p>
      )}

      {message && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <button
        onClick={handleSync}
        disabled={loading}
        className={`w-full px-4 py-2 rounded transition-colors ${
          loading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {loading ? 'Sincronizando...' : 'Sincronizar com Google Calendar'}
      </button>

      <div className="mt-4 text-xs text-gray-500">
        <p>• Esta operação pode levar alguns segundos</p>
        <p>• Apenas administradores podem executar esta ação</p>
        <p>• Os agendamentos serão criados/atualizados no Google Calendar</p>
      </div>
    </div>
  );
};

export default GoogleCalendarSync;
