import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { apiService } from './apiService';

export const useAppState = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    procedures: [],
    sellers: [],
    clients: [],
    appointments: [],
    sales: [],
    stats: {}
  });

  const fetchData = useCallback(async (endpoint, setter) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService[endpoint]();
      setter(response);
    } catch (err) {
      setError(err.message);
      console.error(`Erro ao buscar ${endpoint}:`, err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createData = useCallback(async (endpoint, data, setter) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService[endpoint](data);
      setter(prev => [...prev, response]);
      return response;
    } catch (err) {
      setError(err.message);
      console.error(`Erro ao criar ${endpoint}:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateData = useCallback(async (endpoint, id, data, setter) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService[endpoint](id, data);
      setter(prev => prev.map(item => item.id === id ? response : item));
      return response;
    } catch (err) {
      setError(err.message);
      console.error(`Erro ao atualizar ${endpoint}:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteData = useCallback(async (endpoint, id, setter) => {
    try {
      setLoading(true);
      setError(null);
      await apiService[endpoint](id);
      setter(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      setError(err.message);
      console.error(`Erro ao deletar ${endpoint}:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Carregar dados iniciais quando a sessão estiver disponível
  useEffect(() => {
    if (session?.accessToken) {
      // Carregar dados básicos
      fetchData('getProcedures', setData(prev => ({ ...prev, procedures: [] })));
      fetchData('getSellers', setData(prev => ({ ...prev, sellers: [] })));
      
      // Se for admin, carregar dados adicionais
      if (session.user?.isAdmin) {
        fetchData('getLeads', setData(prev => ({ ...prev, clients: [] })));
        fetchData('getSales', setData(prev => ({ ...prev, sales: [] })));
        fetchData('getAppointments', setData(prev => ({ ...prev, appointments: [] })));
        fetchData('getDashboardStats', setData(prev => ({ ...prev, stats: {} })));
      }
    }
  }, [session, fetchData]);

  return {
    session,
    loading,
    error,
    data,
    fetchData,
    createData,
    updateData,
    deleteData,
    setError
  };
}; 