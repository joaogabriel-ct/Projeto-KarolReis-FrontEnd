import React, { useState, useEffect } from 'react';
import { apiService } from '../utils/apiService';

const AvailabilityChecker = ({ sellerId, selectedDate, onTimeSelect }) => {
  const [availableTimes, setAvailableTimes] = useState([]);
  const [googleEvents, setGoogleEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (sellerId && selectedDate) {
      checkAvailability();
    }
  }, [sellerId, selectedDate]);

  const checkAvailability = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.checkAvailability(sellerId, selectedDate);
      setAvailableTimes(response.available_times || []);
      setGoogleEvents(response.google_calendar_events || []);
    } catch (err) {
      setError('Erro ao verificar disponibilidade');
      console.error('Erro ao verificar disponibilidade:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timeObj) => {
    if (typeof timeObj === 'string') {
      return timeObj;
    }
    if (timeObj && timeObj[0] && timeObj[1]) {
      return `${timeObj[0]} - ${timeObj[1]}`;
    }
    return 'Horário inválido';
  };

  const handleTimeSelect = (timeSlot) => {
    if (onTimeSelect) {
      onTimeSelect(timeSlot);
    }
  };

  if (loading) {
    return (
      <div className="p-4 bg-white rounded-lg shadow">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-8 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Horários Disponíveis</h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {googleEvents.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Eventos do Google Calendar (Ocupados):
          </h4>
          <div className="space-y-1">
            {googleEvents.map((event, index) => (
              <div key={index} className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                <span className="font-medium">{event.start} - {event.end}</span>
                <span className="ml-2">• {event.summary}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {availableTimes.length > 0 ? (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Horários Livres:
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {availableTimes.map((timeSlot, index) => (
              <button
                key={index}
                onClick={() => handleTimeSelect(timeSlot)}
                className="p-2 text-sm bg-green-100 hover:bg-green-200 text-green-800 rounded border border-green-300 transition-colors"
              >
                {formatTime(timeSlot)}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-gray-500 text-center py-4">
          Nenhum horário disponível para esta data
        </div>
      )}

      <button
        onClick={checkAvailability}
        className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Atualizar Disponibilidade
      </button>
    </div>
  );
};

export default AvailabilityChecker;
