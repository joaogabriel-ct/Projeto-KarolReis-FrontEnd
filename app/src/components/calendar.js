import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isToday,
  parse,
  startOfToday,
  startOfWeek,
} from 'date-fns';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

// Função para capitalizar a primeira letra de cada dia
const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

// Componente para exibir os detalhes do agendamento em um card
const AppointmentCard = ({ name, procedure,date, time }) => {
  return (
    <div className="bg-white shadow-md px-4 mb-4 rounded-lg">
      <h2><strong>Procedimento {procedure}</strong></h2>
      <h3><strong>Nome:</strong> {name}</h3>
      <p><strong>Data:</strong> {date}</p>
      <p><strong>Hora:</strong> {time}</p>
    </div>
  );
};

function App() {
  const today = startOfToday();
  const [data, setData] = useState([]);
  useEffect(() => {
    axios
      .get('http://localhost:8000/api/v1/agenda/')
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const [currMonth, setCurrMonth] = useState(format(today, 'MMM-yyyy'));
  let firstDayOfMonth = parse(currMonth, 'MMM-yyyy', new Date());

  const daysInMonth = eachDayOfInterval({
    start: startOfWeek(firstDayOfMonth),
    end: endOfWeek(endOfMonth(firstDayOfMonth)),
  });

  const [selectedDate, setSelectedDate] = useState(today);

  const handlePrevMonth = () => {
    const firstDayOfPrevMonth = add(firstDayOfMonth, { months: -1 });
    setCurrMonth(format(firstDayOfPrevMonth, 'MMM-yyyy'));
  };

  const handleNextMonth = () => {
    const firstDayOfNextMonth = add(firstDayOfMonth, { months: 1 });
    setCurrMonth(format(firstDayOfNextMonth, 'MMM-yyyy'));
  };

  const handleDayClick = (day) => {
    setSelectedDate(day);
  };

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="flex flex-col md:flex-row p-8 h-screen">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-4">
          <p className="font-semibold text-xl">
            {format(firstDayOfMonth, 'MMMM yyyy')}
          </p>
          <div className="flex items-center">
            <ChevronLeftIcon className="w-6 h-6 cursor-pointer" onClick={handlePrevMonth} />
            <ChevronRightIcon className="w-6 h-6 cursor-pointer ml-2" onClick={handleNextMonth} />
          </div>
        </div>
        <div className="grid grid-cols-7 gap-4 mb-4">
          {daysOfWeek.map((day, idx) => (
            <div key={idx} className="text-center font-semibold">
              {capitalizeFirstLetter(day)}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-4">
          {daysInMonth.map((day, idx) => (
            <div
              key={idx}
              className={`cursor-pointer p-2 text-center rounded-full ${isToday(day) ? 'bg-red-500 text-white' : 'hover:bg-blue-500 hover:text-white'} ${selectedDate && isSameDay(day, selectedDate) ? 'bg-green-500 text-white' : ''}`}
              onClick={() => handleDayClick(day)}
            >
              {format(day, 'd')}
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto mt-8 md:mt-0 md:ml-8">
        {selectedDate && (
          <>
            <h2 className="font-semibold px-8 text-xl mb-4">
              Agendamentos para {format(selectedDate, 'dd/MM/yyyy')}
            </h2>
            {data
              .filter((appointment) => isSameDay(parse(appointment.date, 'yyyy-MM-dd', new Date()), selectedDate))
              .map((appointment) => (
                <AppointmentCard key={appointment.id} name={appointment.LEAD.name} procedure={appointment.PROCEDURE.name} date={appointment.date} time={appointment.time} />
              ))}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
