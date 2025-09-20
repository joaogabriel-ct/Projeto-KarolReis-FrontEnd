import React from 'react';

const TimeSlotSelector = ({ availableTimes, selectedTime, onTimeSelect, loading }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Carregando horários...</span>
      </div>
    );
  }

  if (!availableTimes || availableTimes.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500 text-lg font-medium">
          Nenhum horário disponível
        </div>
        <div className="text-gray-400 text-sm mt-2">
          Tente selecionar outra data ou vendedor
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {availableTimes.map((time, index) => {
          const isSelected = selectedTime && 
            selectedTime[0] === time[0] && 
            selectedTime[1] === time[1];
          
          return (
            <button
              key={index}
              className={`
                relative px-4 py-4 rounded-xl text-center transition-all duration-200 
                border-2 font-semibold shadow-sm hover:shadow-md transform hover:scale-105
                ${isSelected 
                  ? 'bg-blue-600 text-white border-blue-600 shadow-lg scale-105' 
                  : 'bg-white text-gray-800 border-gray-300 hover:bg-blue-50 hover:border-blue-400'
                }
              `}
              onClick={() => onTimeSelect(time)}
            >
              <div className="space-y-1">
                <div className={`text-xl font-bold ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                  {time[0]}
                </div>
                <div className={`text-xs ${isSelected ? 'text-blue-100' : 'text-gray-500'}`}>
                  até {time[1]}
                </div>
              </div>
              
              {isSelected && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
      
      <div className="text-center text-sm text-gray-500 mt-4">
        <p>Clique em um horário para selecionar</p>
        <p className="text-xs mt-1">
          {availableTimes.length} horário{availableTimes.length !== 1 ? 's' : ''} disponível{availableTimes.length !== 1 ? 'is' : ''}
        </p>
      </div>
    </div>
  );
};

export default TimeSlotSelector;
