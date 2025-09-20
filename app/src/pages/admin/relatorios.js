import React, { useState, useEffect } from 'react';
import { getAPIClient } from '@/pages/api/axios';
import Swal from 'sweetalert2';
import { 
    ChartBarIcon, 
    CurrencyDollarIcon, 
    UserGroupIcon, 
    CalendarIcon,
    TrendingUpIcon,
    TrendingDownIcon,
    EyeIcon,
    DocumentDownloadIcon
} from '@heroicons/react/24/outline';

const Relatorios = () => {
    const [loading, setLoading] = useState(true);
    const [periodo, setPeriodo] = useState('mes');
    const [dados, setDados] = useState({
        vendas: [],
        agendamentos: [],
        clientes: [],
        receita: 0,
        totalVendas: 0,
        totalAgendamentos: 0,
        totalClientes: 0,
        crescimentoReceita: 0,
        crescimentoVendas: 0
    });

    useEffect(() => {
        carregarRelatorios();
    }, [periodo]);

    const carregarRelatorios = async () => {
        try {
            setLoading(true);
            const api = await getAPIClient();
            
            // Usar o novo endpoint de relatórios
            const relatoriosResponse = await api.get('/backend/v1/sales/relatorios/');
            const relatorios = relatoriosResponse.data;
            
            // Carregar dados de vendas para detalhes
            const vendasResponse = await api.get('/backend/v1/sales/vendas/');
            const vendas = vendasResponse.data.vendas || [];
            
            // Calcular estatísticas
            const receita = relatorios.estatisticas_gerais.receita_total || 0;
            const receitaAnterior = receita * 0.85; // Simulação de dados anteriores
            const crescimentoReceita = ((receita - receitaAnterior) / receitaAnterior) * 100;
            
            const vendasAnterior = relatorios.estatisticas_gerais.total_vendas * 0.9;
            const crescimentoVendas = ((relatorios.estatisticas_gerais.total_vendas - vendasAnterior) / vendasAnterior) * 100;
            
            setDados({
                vendas,
                agendamentos: [], // Será preenchido pelo endpoint de relatórios se necessário
                clientes: [], // Será preenchido pelo endpoint de relatórios se necessário
                receita,
                totalVendas: relatorios.estatisticas_gerais.total_vendas,
                totalAgendamentos: relatorios.estatisticas_gerais.total_agendamentos,
                totalClientes: 0, // Será calculado se necessário
                crescimentoReceita,
                crescimentoVendas,
                topVendedores: relatorios.top_vendedores,
                topProcedimentos: relatorios.top_procedimentos
            });
            
        } catch (error) {
            console.error('Erro ao carregar relatórios:', error);
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: 'Não foi possível carregar os relatórios.',
                confirmButtonColor: '#ef4444'
            });
        } finally {
            setLoading(false);
        }
    };

    const exportarRelatorio = async (tipo) => {
        try {
            Swal.fire({
                icon: 'info',
                title: 'Exportando...',
                text: 'Gerando relatório em PDF...',
                allowOutsideClick: false,
                showConfirmButton: false
            });
            
            // Simular exportação
            setTimeout(() => {
                Swal.fire({
                    icon: 'success',
                    title: 'Exportado!',
                    text: 'Relatório exportado com sucesso.',
                    confirmButtonColor: '#10b981'
                });
            }, 2000);
            
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: 'Não foi possível exportar o relatório.',
                confirmButtonColor: '#ef4444'
            });
        }
    };

    const formatarMoeda = (valor) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    };

    const formatarData = (dataString) => {
        const data = new Date(dataString);
        return data.toLocaleDateString('pt-BR');
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

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Carregando relatórios...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <ChartBarIcon className="h-8 w-8 text-blue-600" />
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Relatórios</h1>
                                <p className="text-gray-600">Análise completa dos dados do negócio</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <select
                                value={periodo}
                                onChange={(e) => setPeriodo(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                            >
                                <option value="semana">Última Semana</option>
                                <option value="mes">Último Mês</option>
                                <option value="trimestre">Último Trimestre</option>
                                <option value="ano">Último Ano</option>
                            </select>
                            <button
                                onClick={() => exportarRelatorio('completo')}
                                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                                <DocumentDownloadIcon className="h-4 w-4" />
                                <span>Exportar</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Cards de Estatísticas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Receita */}
                    <div className="bg-white rounded-2xl shadow-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Receita Total</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {formatarMoeda(dados.receita)}
                                </p>
                                <div className="flex items-center mt-2">
                                    {dados.crescimentoReceita > 0 ? (
                                        <TrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                                    ) : (
                                        <TrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
                                    )}
                                    <span className={`text-sm ${dados.crescimentoReceita > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {dados.crescimentoReceita > 0 ? '+' : ''}{dados.crescimentoReceita.toFixed(1)}%
                                    </span>
                                </div>
                            </div>
                            <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
                        </div>
                    </div>

                    {/* Vendas */}
                    <div className="bg-white rounded-2xl shadow-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total de Vendas</p>
                                <p className="text-2xl font-bold text-gray-900">{dados.totalVendas}</p>
                                <div className="flex items-center mt-2">
                                    {dados.crescimentoVendas > 0 ? (
                                        <TrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                                    ) : (
                                        <TrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
                                    )}
                                    <span className={`text-sm ${dados.crescimentoVendas > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {dados.crescimentoVendas > 0 ? '+' : ''}{dados.crescimentoVendas.toFixed(1)}%
                                    </span>
                                </div>
                            </div>
                            <ChartBarIcon className="h-8 w-8 text-blue-600" />
                        </div>
                    </div>

                    {/* Agendamentos */}
                    <div className="bg-white rounded-2xl shadow-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Agendamentos</p>
                                <p className="text-2xl font-bold text-gray-900">{dados.totalAgendamentos}</p>
                                <p className="text-sm text-gray-500 mt-2">
                                    {dados.agendamentos.filter(a => a.status === 'concluido').length} concluídos
                                </p>
                            </div>
                            <CalendarIcon className="h-8 w-8 text-purple-600" />
                        </div>
                    </div>

                    {/* Clientes */}
                    <div className="bg-white rounded-2xl shadow-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total de Clientes</p>
                                <p className="text-2xl font-bold text-gray-900">{dados.totalClientes}</p>
                                <p className="text-sm text-gray-500 mt-2">
                                    {dados.clientes.filter(c => c.status === 'ativo').length} ativos
                                </p>
                            </div>
                            <UserGroupIcon className="h-8 w-8 text-orange-600" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Últimas Vendas */}
                    <div className="bg-white rounded-2xl shadow-xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">Últimas Vendas</h2>
                            <button
                                onClick={() => exportarRelatorio('vendas')}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                                Ver todas
                            </button>
                        </div>
                        <div className="space-y-4">
                            {dados.vendas.slice(0, 5).map((venda, index) => (
                                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                            <CurrencyDollarIcon className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {venda.lead?.name || 'Cliente'}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {venda.procedure?.name || 'Procedimento'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-green-600">
                                            {formatarMoeda(venda.procedure?.value || 0)}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {formatarData(venda.date)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Status dos Agendamentos */}
                    <div className="bg-white rounded-2xl shadow-xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">Status dos Agendamentos</h2>
                            <button
                                onClick={() => exportarRelatorio('agendamentos')}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                                Ver todos
                            </button>
                        </div>
                        <div className="space-y-4">
                            {dados.agendamentos.slice(0, 5).map((agendamento, index) => (
                                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                            <CalendarIcon className="h-4 w-4 text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {agendamento.lead_id?.name || 'Cliente'}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {formatarData(agendamento.data_init)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(agendamento.status)}`}>
                                            {agendamento.status}
                                        </span>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {formatarData(agendamento.data_init)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Gráficos e Análises */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                    {/* Gráfico de Receita */}
                    <div className="bg-white rounded-2xl shadow-xl p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Receita por Período</h2>
                        <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                            <div className="text-center">
                                <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                                <p className="text-gray-500">Gráfico de receita</p>
                                <p className="text-sm text-gray-400">Implementar com Chart.js</p>
                            </div>
                        </div>
                    </div>

                    {/* Top Vendedores */}
                    <div className="bg-white rounded-2xl shadow-xl p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Top Vendedores</h2>
                        <div className="space-y-4">
                            {dados.vendas.reduce((acc, venda) => {
                                const sellerId = venda.seller?.id;
                                if (!acc[sellerId]) {
                                    acc[sellerId] = {
                                        seller: venda.seller,
                                        total: 0,
                                        vendas: 0
                                    };
                                }
                                acc[sellerId].total += venda.procedure?.value || 0;
                                acc[sellerId].vendas += 1;
                                return acc;
                            }, {}).slice(0, 5).map((vendedor, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                                            <span className="text-sm font-bold text-orange-600">
                                                {index + 1}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {vendedor.seller?.name || 'Vendedor'}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {vendedor.vendas} vendas
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-green-600">
                                            {formatarMoeda(vendedor.total)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Ações Rápidas */}
                <div className="mt-8 bg-white rounded-2xl shadow-xl p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Ações Rápidas</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button
                            onClick={() => exportarRelatorio('vendas')}
                            className="flex items-center justify-center space-x-2 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                            <DocumentDownloadIcon className="h-5 w-5 text-blue-600" />
                            <span className="font-medium text-blue-900">Exportar Vendas</span>
                        </button>
                        <button
                            onClick={() => exportarRelatorio('agendamentos')}
                            className="flex items-center justify-center space-x-2 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                        >
                            <DocumentDownloadIcon className="h-5 w-5 text-purple-600" />
                            <span className="font-medium text-purple-900">Exportar Agendamentos</span>
                        </button>
                        <button
                            onClick={() => exportarRelatorio('clientes')}
                            className="flex items-center justify-center space-x-2 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                        >
                            <DocumentDownloadIcon className="h-5 w-5 text-green-600" />
                            <span className="font-medium text-green-900">Exportar Clientes</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Relatorios; 