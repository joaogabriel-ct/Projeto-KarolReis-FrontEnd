import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format, parseISO } from 'date-fns';

export const AppointmentDetailsModal = ({ appointment, onClose }) => {
    const [novaData, setNovaData] = useState('');
    const [novoHorario, setNovoHorario] = useState('');
    const [acao, setAcao] = useState('');
    const [formaPagamento, setFormaPagamento] = useState('');

    useEffect(() => {
        const handleEsc = (event) => {
            if (event.keyCode === 27) onClose(); // 27 é o código da tecla Esc
        };
        window.addEventListener('keydown', handleEsc);

        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, [onClose]);

    const handleConclusaoVenda = async () => {
        const payload = {
            seller_id: appointment.SELLER.id,
            lead_id: appointment.LEAD.id,
            procedure_id: appointment.PROCEDURE.id,
            date: appointment.date,
            time: appointment.time,
            type_payment: formaPagamento,
        };

        try {
            await axios.post('http://localhost:8000/api/v1/sales/', payload, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            alert('Venda concluída com sucesso!');
            onClose();
        } catch (error) {
            console.error('Erro ao concluir a venda:', error.response ? error.response.data : error.message);
            alert('Falha ao concluir a venda. Verifique o console para mais detalhes.');
        }
    };

    const handleRemarcar = async () => {
        if (!novaData || !novoHorario) {
            alert('Por favor, selecione uma nova data e horário.');
            return;
        }

        try {
            await axios.post(`http://localhost:8000/api/v1/agendamento/remarcar/${appointment.id}/`, {
                date: novaData,
                time: novoHorario,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            alert('Agendamento remarcado com sucesso!');
            onClose();
        } catch (error) {
            console.error('Erro ao remarcar o agendamento:', error.response ? error.response.data : error.message);
            alert('Falha ao remarcar o agendamento. Verifique o console para mais detalhes.');
        }
    };

    const handleAcao = async () => {
        if (acao === 'venda') {
            handleConclusaoVenda();
        } else if (acao === 'remarcar') {
            handleRemarcar();
        }
    };

    if (!appointment) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-40 flex justify-center items-center">
            <div className="bg-white p-4 md:p-8 lg:p-12 rounded-lg shadow-lg max-w-md mx-auto z-50" onClick={e => e.stopPropagation()} style={{ margin: 'auto', maxWidth: '90%', maxHeight: '90vh' }}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Detalhes do Agendamento</h2>
                    <button onClick={onClose} className="text-lg font-semibold rounded-full text-gray-800">X</button>
                </div>
                <p><strong>Procedimento:</strong> {appointment.PROCEDURE.name}</p>
                <p><strong>Cliente:</strong> {appointment.LEAD.name}</p>
                <p><strong>Data:</strong> {format(parseISO(appointment.date), 'dd/MM/yyyy')}</p>
                <p><strong>Hora:</strong> {appointment.time}</p>
                <p><strong>Vendedor:</strong> {appointment.SELLER.name_complete}</p>
                <p><strong>Valor:</strong> R$ {appointment.PROCEDURE.value}</p> {/* Exibe o valor do procedimento */}

                {/* Seletor de ação */}
                <div className="mt-4">
                    <select
                        value={acao}
                        onChange={(e) => setAcao(e.target.value)}
                        className="px-4 py-2 border rounded"
                    >
                        <option value="">Selecione uma ação</option>
                        <option value="venda">Concluir Venda</option>
                        <option value="remarcar">Remarcar</option>
                    </select>
                </div>

                {/* Campos baseados na ação selecionada */}
                {acao === 'venda' && (
                    <div className="mt-4">
                        <select
                            value={formaPagamento}
                            onChange={(e) => setFormaPagamento(e.target.value)}
                            className="px-4 py-2 border rounded"
                        >
                            <option value="">Selecione a forma de pagamento</option>
                            <option value="1">Cartão de Crédito</option>
                            <option value="2">Boleto</option>
                            <option value="3">Pix</option>
                            <option value="4">Dinheiro</option>
                        </select>
                    </div>
                )}

                {acao === 'remarcar' && (
                    <div className="mt-4">
                        <input
                            type="date"
                            value={novaData}
                            onChange={(e) => setNovaData(e.target.value)}
                            className="px-4 py-2 border rounded"
                        />
                        <input
                            type="time"
                            value={novoHorario}
                            onChange={(e) => setNovoHorario(e.target.value)}
                            className="ml-2 px-4 py-2 border rounded"
                        />
                    </div>
                )}

                <div className="flex justify-between mt-4">
                    <button onClick={handleAcao} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
                        {acao === 'venda' ? 'Concluir Venda' : 'Confirmar Remarcação'}
                    </button>
                </div>
            </div>
        </div>
    );
};