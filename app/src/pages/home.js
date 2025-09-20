import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { apiService } from '@/utils/apiService';
import { useNotifications } from '@/components/NotificationSystem';
import { BarChart, PieChart, LineChart, MetricCard, CircularProgress } from '@/components/DashboardCharts';

const Dashboard = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { showSuccess, showError, showWarning, showInfo } = useNotifications();
  const [stats, setStats] = useState({
    totalAppointments: 0,
    todayAppointments: 0,
    totalRevenue: 0,
    pendingAppointments: 0,
    completedAppointments: 0,
    totalClients: 0
  });
  
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  // Dados reais dos gráficos
  const [chartData, setChartData] = useState({
    weeklyAppointments: [],
    appointmentTypes: [],
    revenueTrend: []
  });

  // Estado para agendamentos recentes
  const [recentAppointments, setRecentAppointments] = useState([]);

  // Ícones SVG inline
  const CalendarIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );

  const DollarSignIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
    </svg>
  );

  const UsersIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
    </svg>
  );

  const TrendingUpIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  );

  const ClockIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const CheckCircleIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const AlertCircleIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const BarChart3Icon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (isLoading) return; // Evitar múltiplas chamadas simultâneas
      
      try {
        setIsLoading(true);
        setLoading(true);
        
        // Buscar dados do dashboard
        const [statsData, appointmentsData, weeklyData, typesData, revenueData] = await Promise.all([
          apiService.getDashboardStats(),
          apiService.getRecentAppointments(),
          apiService.getWeeklyAppointments(),
          apiService.getAppointmentTypes(),
          apiService.getRevenueTrend()
        ]);

        setStats(statsData);
        setRecentAppointments(appointmentsData);
        // Transform revenue data to match LineChart expected format
        const transformedRevenueData = (revenueData.monthly_revenue || []).map(item => ({
          label: new Date(item.month).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }),
          value: item.total_revenue || 0
        }));

        setChartData({
          weeklyAppointments: weeklyData,
          appointmentTypes: typesData,
          revenueTrend: transformedRevenueData
        });
        
        // Notificação de sucesso
        showSuccess('Dashboard Carregado', 'Dados atualizados com sucesso!');
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
        showError('Erro ao carregar dados do dashboard');
      } finally {
        setLoading(false);
        setIsLoading(false);
      }
    };

    if (session?.accessToken && !isLoading) {
      fetchDashboardData();
    }
  }, [session?.accessToken]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'agendado':
        return 'bg-blue-100 text-blue-800';
      case 'confirmado':
        return 'bg-green-100 text-green-800';
      case 'cancelado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'agendado':
        return <ClockIcon />;
      case 'confirmado':
        return <CheckCircleIcon />;
      case 'cancelado':
        return <AlertCircleIcon />;
      default:
        return <ClockIcon />;
    }
  };

  // Redirecionar se não houver sessão
  if (!session?.accessToken) {
    router.push('/login');
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">Visão geral do seu negócio</p>
        </div>

        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total de Agendamentos"
            value={stats.totalAppointments}
            icon={<CalendarIcon />}
            trend="+12%"
            trendDirection="up"
            color="blue"
          />
          <MetricCard
            title="Receita Total"
            value={formatCurrency(stats.totalRevenue)}
            icon={<DollarSignIcon />}
            trend="+8%"
            trendDirection="up"
            color="green"
          />
          <MetricCard
            title="Total de Clientes"
            value={stats.totalClients}
            icon={<UsersIcon />}
            trend="+5%"
            trendDirection="up"
            color="purple"
          />
          <MetricCard
            title="Agendamentos Hoje"
            value={stats.todayAppointments}
            icon={<TrendingUpIcon />}
            trend="+15%"
            trendDirection="up"
            color="orange"
          />
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Agendamentos Semanais</h3>
            <BarChart data={chartData.weeklyAppointments} />
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tipos de Procedimentos</h3>
            <PieChart data={chartData.appointmentTypes} />
          </div>
        </div>

        {/* Gráfico de Receita */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tendência de Receita</h3>
          <LineChart data={chartData.revenueTrend} />
        </div>

                 {/* Agendamentos Recentes */}
         <div className="bg-white rounded-lg shadow">
           <div className="px-6 py-4 border-b border-gray-200">
             <h3 className="text-lg font-semibold text-gray-900">Agendamentos Recentes</h3>
           </div>
           <div className="overflow-x-auto">
             <table className="min-w-full divide-y divide-gray-200">
               <thead className="bg-gray-50">
                 <tr>
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                     Cliente
                   </th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                     Data/Hora
                   </th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                     Vendedor
                   </th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                     Status
                   </th>
                 </tr>
               </thead>
               <tbody className="bg-white divide-y divide-gray-200">
                 {recentAppointments.map((appointment) => (
                   <tr key={appointment.id} className="hover:bg-gray-50">
                     <td className="px-6 py-4 whitespace-nowrap">
                       <div className="text-sm font-medium text-gray-900">
                         {appointment.client || 'Cliente não informado'}
                       </div>
                     </td>
                     <td className="px-6 py-4 whitespace-nowrap">
                       <div className="text-sm text-gray-900">
                         {formatDate(appointment.date)}
                       </div>
                     </td>
                     <td className="px-6 py-4 whitespace-nowrap">
                       <div className="text-sm text-gray-900">
                         {appointment.seller || 'Não atribuído'}
                       </div>
                     </td>
                     <td className="px-6 py-4 whitespace-nowrap">
                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                         {getStatusIcon(appointment.status)}
                         <span className="ml-1">{appointment.status}</span>
                       </span>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
         </div>
      </div>
    </div>
  );
};

export default Dashboard;