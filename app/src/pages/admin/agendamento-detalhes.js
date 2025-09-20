import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getAPIClient } from '@/pages/api/axios';
import Swal from 'sweetalert2';
import { 
    CalendarIcon, 
    ClockIcon, 
    UserIcon, 
    CurrencyDollarIcon,
    CheckCircleIcon,
    XCircleIcon,
    PencilIcon,
    TrashIcon,
    PhoneIcon,
    EnvelopeIcon,
    MapPinIcon
} from '@heroicons/react/24/outline';

const AgendamentoDetalhes = () => {
    const router = useRouter();
    const { id } = router.query;
    const [agendamento, setAgendamento] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editando, setEditando] = useState(false);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        if (id) {
            carregarAgendamento();
        }
    }, [id]);

    const carregarAgendamento = async () => {
        try {
            setLoading(true);
            const api = await getAPIClient();
            const response = await api.get(`/backend/v1/agenda/${id}/`);
            setAgendamento(response.data);
            setFormData({
                titulo: response.data.titulo,
                data_init: response.data.data_init,
                status: response.data.status
            });
        } catch (error) {
            console.error('Erro ao carregar agendamento:', error);
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: 'Não foi possível carregar os detalhes do agendamento.',
                confirmButtonColor: '#ef4444'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const salvarEdicao = async () => {
        try {
            const api = await getAPIClient();
            await api.put(`/backend/v1/agenda/${id}/`, formData);
            await carregarAgendamento();
            setEditando(false);
            Swal.fire({
                icon: 'success',
                title: 'Sucesso!',
                text: 'Agendamento atualizado com sucesso.',
                confirmButtonColor: '#10b981'
            });
        } catch (error) {
            console.error('Erro ao atualizar agendamento:', error);
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: 'Não foi possível atualizar o agendamento.',
                confirmButtonColor: '#ef4444'
            });
        }
    };

    const cancelarAgendamento = async () => {
        const result = await Swal.fire({
            icon: 'warning',
            title: 'Cancelar Agendamento',
            text: 'Tem certeza que deseja cancelar este agendamento?',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Sim, cancelar',
            cancelButtonText: 'Não'
        });

        if (result.isConfirmed) {
            try {
                const api = await getAPIClient();
                await api.put(`/backend/v1/agenda/${id}/`, {
                    ...agendamento,
                    status: 'cancelado'
                });
                await carregarAgendamento();
                Swal.fire({
                    icon: 'success',
                    title: 'Cancelado!',
                    text: 'Agendamento cancelado com sucesso.',
                    confirmButtonColor: '#10b981'
                });
            } catch (error) {
                console.error('Erro ao cancelar agendamento:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Erro',
                    text: 'Não foi possível cancelar o agendamento.',
                    confirmButtonColor: '#ef4444'
                });
            }
        }
    };

    const concluirAtendimento = async () => {
        const result = await Swal.fire({
            icon: 'question',
            title: 'Concluir Atendimento',
            text: 'Deseja marcar este atendimento como concluído e gerar uma venda?',
            showCancelButton: true,
            confirmButtonColor: '#10b981',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Sim, concluir',
            cancelButtonText: 'Não'
        });

        if (result.isConfirmed) {
            try {
                const api = await getAPIClient();
                
                // Usar o novo endpoint que faz tudo automaticamente
                const response = await api.post(`/backend/v1/sales/agendamento/concluir/${id}/`, {
                    type_payment: 1, // Cartão de crédito como padrão
                    observations: ''
                });

                await carregarAgendamento();
                Swal.fire({
                    icon: 'success',
                    title: 'Concluído!',
                    text: 'Atendimento concluído e venda gerada com sucesso.',
                    confirmButtonColor: '#10b981'
                });
            } catch (error) {
                console.error('Erro ao concluir atendimento:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Erro',
                    text: 'Não foi possível concluir o atendimento.',
                    confirmButtonColor: '#ef4444'
                });
            }
        }
    };

    const formatarData = (dataString) => {
        const data = new Date(dataString);
        return data.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const formatarHora = (dataString) => {
        const data = new Date(dataString);
        return data.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'agendado': return 'bg-blue-100 text-blue-800';
            case 'confirmado': return 'bg-green-100 text-green-800';
            case 'cancelado': return 'bg-red-100 text-red-800';
            case 'concluido': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'agendado': return 'Agendado';
            case 'confirmado': return 'Confirmado';
            case 'cancelado': return 'Cancelado';
            case 'concluido': return 'Concluído';
            default: return status;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Carregando detalhes...</p>
                </div>
            </div>
        );
    }

    if (!agendamento) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <XCircleIcon className="h-12 w-12 text-red-500 mx-auto" />
                    <p className="mt-4 text-gray-600">Agendamento não encontrado</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <CalendarIcon className="h-8 w-8 text-blue-600" />
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    {editando ? 'Editar Agendamento' : 'Detalhes do Agendamento'}
                                </h1>
                                <p className="text-gray-600">ID: #{agendamento.id}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(agendamento.status)}`}>
                                {getStatusText(agendamento.status)}
                            </span>
                            <button
                                onClick={() => router.back()}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                Voltar
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Informações Principais */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Detalhes do Agendamento */}
                        <div className="bg-white rounded-2xl shadow-xl p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                <CalendarIcon className="h-5 w-5 text-blue-600 mr-2" />
                                Detalhes do Agendamento
                            </h2>
                            
                            {editando ? (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Título
                                        </label>
                                        <input
                                            type="text"
                                            name="titulo"
                                            value={formData.titulo}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Data e Hora
                                        </label>
                                        <input
                                            type="datetime-local"
                                            name="data_init"
                                            value={formData.data_init?.slice(0, 16)}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                                        />
                                    </div>
                                    <div className="flex space-x-3">
                                        <button
                                            onClick={salvarEdicao}
                                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                        >
                                            Salvar
                                        </button>
                                        <button
                                            onClick={() => setEditando(false)}
                                            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-center space-x-3">
                                            <CalendarIcon className="h-5 w-5 text-blue-600" />
                                            <div>
                                                <p className="text-sm text-gray-500">Data</p>
                                                <p className="font-medium text-gray-900">
                                                    {formatarData(agendamento.data_init)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <ClockIcon className="h-5 w-5 text-blue-600" />
                                            <div>
                                                <p className="text-sm text-gray-500">Horário</p>
                                                <p className="font-medium text-gray-900">
                                                    {formatarHora(agendamento.data_init)} - {formatarHora(agendamento.data_end)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Título</p>
                                        <p className="font-medium text-gray-900">{agendamento.titulo}</p>
                                    </div>
                                    <button
                                        onClick={() => setEditando(true)}
                                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        <PencilIcon className="h-4 w-4" />
                                        <span>Editar</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Informações do Cliente */}
                        <div className="bg-white rounded-2xl shadow-xl p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                <UserIcon className="h-5 w-5 text-green-600 mr-2" />
                                Informações do Cliente
                            </h2>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <UserIcon className="h-5 w-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-500">Nome</p>
                                        <p className="font-medium text-gray-900">{agendamento.lead_id?.name}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <PhoneIcon className="h-5 w-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-500">Telefone</p>
                                        <p className="font-medium text-gray-900">{agendamento.lead_id?.phone}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-500">Email</p>
                                        <p className="font-medium text-gray-900">{agendamento.lead_id?.email}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Procedimentos */}
                        <div className="bg-white rounded-2xl shadow-xl p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                <CurrencyDollarIcon className="h-5 w-5 text-purple-600 mr-2" />
                                Procedimentos
                            </h2>
                            <div className="space-y-3">
                                {agendamento.procedures?.map((procedure, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div>
                                            <p className="font-medium text-gray-900">{procedure.name}</p>
                                            <p className="text-sm text-gray-500">
                                                Duração: {procedure.duration} min
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-green-600">
                                                R$ {parseFloat(procedure.value).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                <div className="border-t pt-3">
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold text-gray-900">Total</span>
                                        <span className="font-bold text-green-600 text-lg">
                                            R$ {agendamento.procedures?.reduce((total, proc) => total + parseFloat(proc.value), 0).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - Ações */}
                    <div className="space-y-6">
                        {/* Ações */}
                        <div className="bg-white rounded-2xl shadow-xl p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações</h3>
                            <div className="space-y-3">
                                {agendamento.status === 'agendado' && (
                                    <>
                                        <button
                                            onClick={concluirAtendimento}
                                            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                        >
                                            <CheckCircleIcon className="h-5 w-5" />
                                            <span>Concluir Atendimento</span>
                                        </button>
                                        <button
                                            onClick={cancelarAgendamento}
                                            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                        >
                                            <XCircleIcon className="h-5 w-5" />
                                            <span>Cancelar</span>
                                        </button>
                                    </>
                                )}
                                {agendamento.status === 'concluido' && (
                                    <div className="text-center p-4 bg-green-50 rounded-lg">
                                        <CheckCircleIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
                                        <p className="text-green-800 font-medium">Atendimento Concluído</p>
                                        <p className="text-green-600 text-sm">Venda gerada automaticamente</p>
                                    </div>
                                )}
                                {agendamento.status === 'cancelado' && (
                                    <div className="text-center p-4 bg-red-50 rounded-lg">
                                        <XCircleIcon className="h-8 w-8 text-red-600 mx-auto mb-2" />
                                        <p className="text-red-800 font-medium">Agendamento Cancelado</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Informações do Vendedor */}
                        <div className="bg-white rounded-2xl shadow-xl p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Vendedor</h3>
                            <div className="flex items-center space-x-3">
                                <UserIcon className="h-8 w-8 text-blue-600" />
                                <div>
                                    <p className="font-medium text-gray-900">{agendamento.seller_id?.name}</p>
                                    <p className="text-sm text-gray-500">{agendamento.seller_id?.email}</p>
                                </div>
                            </div>
                        </div>

                        {/* Histórico */}
                        <div className="bg-white rounded-2xl shadow-xl p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Histórico</h3>
                            <div className="space-y-3">
                                <div className="flex items-center space-x-3">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Agendamento criado</p>
                                        <p className="text-xs text-gray-500">
                                            {formatarData(agendamento.data_created)} às {formatarHora(agendamento.data_created)}
                                        </p>
                                    </div>
                                </div>
                                {agendamento.remarcado && (
                                    <div className="flex items-center space-x-3">
                                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Agendamento remarcado</p>
                                            <p className="text-xs text-gray-500">
                                                {agendamento.contador_remarcacoes} vez(es)
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {agendamento.status === 'concluido' && (
                                    <div className="flex items-center space-x-3">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Atendimento concluído</p>
                                            <p className="text-xs text-gray-500">Venda gerada</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgendamentoDetalhes; 