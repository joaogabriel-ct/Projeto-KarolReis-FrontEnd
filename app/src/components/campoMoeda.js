import React from 'react';

export const CampoMoeda = React.forwardRef(({ onChange, onBlur, name, placeholder }, ref) => {
    const formatarMoeda = (valor) => {
        let apenasNumeros = valor.replace(/[^0-9]/g, '');
        let num = parseInt(apenasNumeros, 10) / 100; 
        if (isNaN(num)) return ""; 

        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(num);
    };

    const aoDigitado = (evento) => {
        evento.target.value = formatarMoeda(evento.target.value);
        onChange(evento); // Notifica o react-hook-form sobre a mudança
    };

    return (
        <input
            ref={ref}
            name={name}
            onChange={aoDigitado}
            onBlur={onBlur} 
            placeholder={placeholder}
            className="bg-white border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-gray-500"
            type="text"
        />
    );
});

CampoMoeda.displayName = 'CampoMoeda';
