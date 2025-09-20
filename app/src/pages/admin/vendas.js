import React, { useState, useEffect } from 'react';
import { getAPIClient } from '@/pages/api/axios';
import Swal from 'sweetalert2';
import { 
    CurrencyDollarIcon, 
    PlusIcon, 
    MagnifyingGlassIcon,
    FunnelIcon,
    EyeIcon,
    PencilIcon,
    TrashIcon,
    UserIcon,
    CalendarIcon,
    CreditCardIcon
} from '@heroicons/react/24/outline';

const Vendas = () => {
    const [vendas, setVendas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('todos');
    const [showModal, setShowModal] = useState(false);
    const [selectedVenda, setSelectedVenda] = useState(null);
    const [formData, setFormData] = useState({
        seller: '',
        lead: '',
        procedure: '',
        type_payment: 1,
        date: '',
        time: ''
    });

    useEffect(() => {
        carregarVendas();
    }, []);

    const carregarVendas = async () => {
        try {
            setLoading(true);
            const api = await getAPIClient();
            const response = await api.get('/backend/v1/sales/vendas/');
            setVendas(response.data.vendas || []);
        } catch (error) {
            console.error('Erro ao carregar vendas:', error);
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: 'Não foi possível carregar as vendas.',
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

    const criarVenda = async () => {
        try {
            const api = await getAPIClient();
            await api.post('/backend/v1/sales/vendas/', formData);
            await carregarVendas();
            setShowModal(false);
            setFormData({
                seller: '',
                lead: '',
                procedure: '',
                type_payment: 1,
                date: '',
                time: ''
            });
            Swal.fire({
                icon: 'success',
                title: 'Sucesso!',
                text: 'Venda criada com sucesso.',
                confirmButtonColor: '#10b981'
            });
        } catch (error) {
            console.error('Erro ao criar venda:', error);
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: 'Não foi possível criar a venda.',
                confirmButtonColor: '#ef4444'
            });
        }
    };

    const deletarVenda = async (id) => {
        const result = await Swal.fire({
            icon: 'warning',
            title: 'Deletar Venda',
            text: 'Tem certeza que deseja deletar esta venda?',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Sim, deletar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                const api = await getAPIClient();
                await api.delete(`/backend/v1/sales/vendas/${id}/`);
                await carregarVendas();
                Swal.fire({
                    icon: 'success',
                    title: 'Deletado!',
                    text: 'Venda deletada com sucesso.',
                    confirmButtonColor: '#10b981'
                });
            } catch (error) {
                console.error('Erro ao deletar venda:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Erro',
                    text: 'Não foi possível deletar a venda.',
                    confirmButtonColor: '#ef4444'
                });
            }
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

    const formatarHora = (horaString) => {
        if (!horaString) return '';
        return horaString.slice(0, 5);
    };

    const getPaymentTypeText = (type) => {
        switch (type) {
            case 1: return 'Cartão de Crédito';
            case 2: return 'Boleto';
            case 3: return 'Pix';
            case 4: return 'Dinheiro';
            default: return 'Não informado';
        }
    };

    const getPaymentTypeIcon = (type) => {
        switch (type) {
            case 1: return '💳';
            case 2: return '📄';
            case 3: return '📱';
            case 4: return '💵';
            default: return '❓';
        }
    };

    const vendasFiltradas = vendas.filter(venda => {
        const matchesSearch = 
            venda.lead?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            venda.seller?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            venda.procedure?.name?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesFilter = filterStatus === 'todos' || venda.type_payment === parseInt(filterStatus);
        
        return matchesSearch && matchesFilter;
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Carregando vendas...</p>
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
                            <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Vendas</h1>
                                <p className="text-gray-600">Gerencie todas as vendas do sistema</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowModal(true)}
                            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            <PlusIcon className="h-4 w-4" />
                            <span>Nova Venda</span>
                        </button>
                    </div>
                </div>

                {/* Filtros e Busca */}
                <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="relative">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Buscar por cliente, vendedor ou procedimento..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                            />
                        </div>
                        <div className="relative">
                            <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                            >
                                <option value="todos">Todos os Pagamentos</option>
                                <option value="1">Cartão de Crédito</option>
                                <option value="2">Boleto</option>
                                <option value="3">Pix</option>
                                <option value="4">Dinheiro</option>
                            </select>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-600">Total de vendas</p>
                            <p className="text-2xl font-bold text-gray-900">{vendasFiltradas.length}</p>
                        </div>
                    </div>
                </div>

                {/* Lista de Vendas */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Cliente
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Vendedor
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Procedimento
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Valor
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Pagamento
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Data
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ações
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {vendasFiltradas.map((venda, index) => (
                                    <tr key={venda.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <UserIcon className="h-4 w-4 text-blue-600" />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {venda.lead?.name || 'Cliente'}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {venda.lead?.email || 'Email não informado'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {venda.seller?.name || 'Vendedor'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {venda.procedure?.name || 'Procedimento'}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {venda.procedure?.duration || 0} min
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-semibold text-green-600">
                                                {formatarMoeda(venda.procedure?.value || 0)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <span className="text-lg mr-2">
                                                    {getPaymentTypeIcon(venda.type_payment)}
                                                </span>
                                                <span className="text-sm text-gray-900">
                                                    {getPaymentTypeText(venda.type_payment)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <CalendarIcon className="h-4 w-4 text-gray-400 mr-2" />
                                                <div>
                                                    <div className="text-sm text-gray-900">
                                                        {formatarData(venda.date)}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {formatarHora(venda.time)}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedVenda(venda);
                                                        setShowModal(true);
                                                    }}
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    <EyeIcon className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => deletarVenda(venda.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    <TrashIcon className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Modal de Nova Venda */}
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                {selectedVenda ? 'Editar Venda' : 'Nova Venda'}
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Cliente
                                    </label>
                                    <input
                                        type="text"
                                        name="lead"
                                        value={formData.lead}
                                        onChange={handleInputChange}
                                        placeholder="Nome do cliente"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Vendedor
                                    </label>
                                    <input
                                        type="text"
                                        name="seller"
                                        value={formData.seller}
                                        onChange={handleInputChange}
                                        placeholder="Nome do vendedor"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Procedimento
                                    </label>
                                    <input
                                        type="text"
                                        name="procedure"
                                        value={formData.procedure}
                                        onChange={handleInputChange}
                                        placeholder="Nome do procedimento"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Forma de Pagamento
                                    </label>
                                    <select
                                        name="type_payment"
                                        value={formData.type_payment}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                                    >
                                        <option value={1}>Cartão de Crédito</option>
                                        <option value={2}>Boleto</option>
                                        <option value={3}>Pix</option>
                                        <option value={4}>Dinheiro</option>
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Data
                                        </label>
                                        <input
                                            type="date"
                                            name="date"
                                            value={formData.date}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Hora
                                        </label>
                                        <input
                                            type="time"
                                            name="time"
                                            value={formData.time}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex space-x-3 mt-6">
                                <button
                                    onClick={criarVenda}
                                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    {selectedVenda ? 'Atualizar' : 'Criar'}
                                </button>
                                <button
                                    onClick={() => {
                                        setShowModal(false);
                                        setSelectedVenda(null);
                                        setFormData({
                                            seller: '',
                                            lead: '',
                                            procedure: '',
                                            type_payment: 1,
                                            date: '',
                                            time: ''
                                        });
                                    }}
                                    className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Vendas; 