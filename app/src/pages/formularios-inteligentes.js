import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import ClientForm from '@/components/ClientForm';
import { useNotifications } from '@/components/NotificationSystem';

const FormulariosInteligentes = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { showInfo } = useNotifications();
  const [activeTab, setActiveTab] = useState('cliente');

  // Redirecionar se não estiver logado
  if (!session) {
    router.push('/login');
    return null;
  }

  const tabs = [
    { id: 'cliente', label: 'Cadastro de Cliente', icon: '👤' },
    { id: 'agendamento', label: 'Novo Agendamento', icon: '📅' },
    { id: 'procedimento', label: 'Procedimento', icon: '💉' }
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    showInfo('Formulário Alterado', `Agora você está no formulário de ${tabs.find(tab => tab.id === tabId)?.label.toLowerCase()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Formulários Inteligentes
              </h1>
              <p className="text-gray-600 mt-1">
                Sistema de formulários com validação em tempo real
              </p>
            </div>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-200 transition-colors duration-200"
            >
              Voltar
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto py-8">
        {activeTab === 'cliente' && (
          <div>
            <ClientForm />
          </div>
        )}
        
        {activeTab === 'agendamento' && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Formulário de Agendamento
            </h3>
            <p className="text-gray-600">
              Em desenvolvimento - Será implementado em breve!
            </p>
          </div>
        )}
        
        {activeTab === 'procedimento' && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💉</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Formulário de Procedimento
            </h3>
            <p className="text-gray-600">
              Em desenvolvimento - Será implementado em breve!
            </p>
          </div>
        )}
      </div>

      {/* Features Info */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            🚀 Funcionalidades dos Formulários Inteligentes
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-blue-600 text-2xl mb-2">✅</div>
              <h3 className="font-medium text-blue-900 mb-1">Validação em Tempo Real</h3>
              <p className="text-blue-700 text-sm">
                Campos são validados conforme o usuário digita, com feedback imediato
              </p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-green-600 text-2xl mb-2">🎭</div>
              <h3 className="font-medium text-green-900 mb-1">Máscaras de Input</h3>
              <p className="text-green-700 text-sm">
                CPF, telefone e outros campos formatados automaticamente
              </p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-purple-600 text-2xl mb-2">🔍</div>
              <h3 className="font-medium text-purple-900 mb-1">Select com Busca</h3>
              <p className="text-purple-700 text-sm">
                Dropdowns com funcionalidade de busca para facilitar a seleção
              </p>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-yellow-600 text-2xl mb-2">📱</div>
              <h3 className="font-medium text-yellow-900 mb-1">Responsivo</h3>
              <p className="text-yellow-700 text-sm">
                Layout adaptável para desktop, tablet e mobile
              </p>
            </div>
            
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-red-600 text-2xl mb-2">⚡</div>
              <h3 className="font-medium text-red-900 mb-1">Performance</h3>
              <p className="text-red-700 text-sm">
                Validação otimizada sem impactar a performance da aplicação
              </p>
            </div>
            
            <div className="bg-indigo-50 p-4 rounded-lg">
              <div className="text-indigo-600 text-2xl mb-2">🎨</div>
              <h3 className="font-medium text-indigo-900 mb-1">Design System</h3>
              <p className="text-indigo-700 text-sm">
                Componentes consistentes com o design system do projeto
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormulariosInteligentes; 