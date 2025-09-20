import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { schedulingService } from '../utils/schedulingService';

const GoogleCalendarCallback = () => {
  const router = useRouter();
  const [status, setStatus] = useState('Processando autenticação...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Pega os parâmetros da URL
        const { code, state } = router.query;
        
        if (!code) {
          setStatus('Erro: código de autorização não encontrado');
          return;
        }

        // Faz a requisição para o backend processar o callback
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/backend/v1'}/calendar/google/callback/?code=${code}&state=${state}`);
        const data = await response.json();

        if (response.ok) {
          // Processa a resposta do callback
          const result = await schedulingService.googleCalendar.handleCallback(data);
          
          if (result.success) {
            setStatus('Autenticação concluída com sucesso!');
            // Redireciona para a página de agendamento após 2 segundos
            setTimeout(() => {
              router.push('/agendamento');
            }, 2000);
          } else {
            setStatus('Erro ao processar eventos do calendário');
          }
        } else {
          setStatus(`Erro: ${data.detail || 'Falha na autenticação'}`);
        }
      } catch (error) {
        console.error('Erro no callback:', error);
        setStatus('Erro ao processar autenticação');
      }
    };

    if (router.isReady) {
      handleCallback();
    }
  }, [router.isReady, router.query]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Autenticação Google Calendar
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {status}
          </p>
        </div>
      </div>
    </div>
  );
};

export default GoogleCalendarCallback; 