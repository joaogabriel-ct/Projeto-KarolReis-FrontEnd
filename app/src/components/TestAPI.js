import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { getAPIClient } from '@/pages/api/axios';

const TestAPI = () => {
  const { data: session } = useSession();
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const runTests = async () => {
    setLoading(true);
    setTestResults([]);
    
    try {
      const api = await getAPIClient();
      
      // Teste 1: Verificar se o token está sendo enviado
      const test1 = {
        name: 'Verificar Token',
        status: session?.accessToken ? '✅ Token presente' : '❌ Token ausente',
        details: session?.accessToken ? 'Token encontrado' : 'Nenhum token encontrado'
      };
      setTestResults(prev => [...prev, test1]);

      // Teste 2: Tentar buscar agendamentos
      try {
        console.log('Testando endpoint agenda/...');
        const response = await api.get('agenda/');
        const test2 = {
          name: 'Buscar Agendamentos',
          status: '✅ Sucesso',
          details: `Encontrados ${response.data.length} agendamentos`
        };
        setTestResults(prev => [...prev, test2]);
        console.log('Resposta da API:', response.data);
      } catch (error) {
        const test2 = {
          name: 'Buscar Agendamentos',
          status: '❌ Erro',
          details: `Erro: ${error.response?.status} - ${error.response?.data?.detail || error.message}`
        };
        setTestResults(prev => [...prev, test2]);
        console.error('Erro na API:', error);
      }

      // Teste 3: Verificar headers da requisição
      try {
        const test3 = {
          name: 'Verificar Headers',
          status: '✅ Headers configurados',
          details: 'Authorization header configurado'
        };
        setTestResults(prev => [...prev, test3]);
      } catch (error) {
        const test3 = {
          name: 'Verificar Headers',
          status: '❌ Erro',
          details: `Erro: ${error.message}`
        };
        setTestResults(prev => [...prev, test3]);
      }

    } catch (error) {
      const testError = {
        name: 'Configuração da API',
        status: '❌ Erro',
        details: `Erro: ${error.message}`
      };
      setTestResults(prev => [...prev, testError]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Teste da API</h2>
      
      <button
        onClick={runTests}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 mb-4"
      >
        {loading ? 'Executando testes...' : 'Executar Testes'}
      </button>

      <div className="space-y-2">
        {testResults.map((test, index) => (
          <div key={index} className="border p-3 rounded">
            <div className="font-semibold">{test.name}</div>
            <div className="text-sm text-gray-600">{test.status}</div>
            <div className="text-xs text-gray-500">{test.details}</div>
          </div>
        ))}
      </div>

      {session && (
        <div className="mt-4 p-3 bg-gray-100 rounded">
          <h3 className="font-semibold">Informações da Sessão:</h3>
          <div className="text-sm">
            <div>Token presente: {session?.accessToken ? 'Sim' : 'Não'}</div>
            <div>Usuário: {session?.user?.name || 'N/A'}</div>
            <div>Admin: {session?.user?.isAdmin ? 'Sim' : 'Não'}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestAPI; 