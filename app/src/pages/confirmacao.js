import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { apiService } from "@/utils/apiService";
import moment from 'moment';
import { Container } from '@/components/container';
import { useSession } from 'next-auth/react';
import Swal from 'sweetalert2';

export default function ConfirmAppointment() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Recebendo os parâmetros passados via query, incluindo os dados do cliente se existir
  const { 
    procedures, 
    procedureNames, 
    seller, 
    sellerName, 
    date, 
    time, 
    clientId, 
    clientName, 
    clientPhone 
  } = router.query;

  // Determina qual id será usado para o agendamento (caso haja cliente selecionado, usa-o; caso contrário, usa o id do usuário da sessão)
  const appointmentLeadId = clientId 
    ? clientId 
    : (session?.user?.lead_id ? session.user.lead_id : session?.user?.id);

  // Verifica se o usuário está autenticado
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/login');
    }
  }, [status, router]);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      
      // Concatena data e horário e formata para ISO
      const formattedDateTime = moment(`${date} ${time}`, 'YYYY-MM-DD HH:mm')
        .format('YYYY-MM-DDTHH:mm:ssZ');
      
      // Realiza a requisição para confirmar o agendamento
      const response = await apiService.createAppointment({
        lead_id: appointmentLeadId,
        procedure_ids: procedures.split(','), // Supondo que procedures seja uma string separada por vírgulas
        seller_id: seller,
        data_init: formattedDateTime,
      });

      console.log('Agendamento confirmado', response);

      // Exibe SweetAlert com opção de agendar outro procedimento
      Swal.fire({
        title: '✅ Agendamento Confirmado!',
        text: 'Seu agendamento foi realizado com sucesso. Deseja agendar outro procedimento?',
        icon: 'success',
        showCancelButton: true,
        confirmButtonText: 'Sim, agendar outro',
        cancelButtonText: 'Não, finalizar',
        confirmButtonColor: '#3B82F6',
        cancelButtonColor: '#6B7280',
        customClass: {
          popup: 'rounded-lg',
          confirmButton: 'rounded-md',
          cancelButton: 'rounded-md'
        }
      }).then((result) => {
        if (result.isConfirmed) {
          router.push('/services');
        } else {
          router.push('/home');
        }
      });

    } catch (error) {
      console.error('Erro ao confirmar agendamento:', error);
      Swal.fire({
        title: '❌ Erro!',
        text: 'Ocorreu um erro ao tentar confirmar o agendamento. Tente novamente.',
        icon: 'error',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#EF4444'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  // Formata a data para exibição
  const formattedDate = moment(date).format('DD/MM/YYYY');
  const formattedTime = moment(time, 'HH:mm').format('HH:mm');

  // Enquanto a sessão não estiver carregada, exibe uma mensagem de carregamento
  if (!session) {
    return (
      <Container>
        <div className="flex justify-center items-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando...</p>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Confirme seu Agendamento</h1>
            <p className="text-gray-600">Revise os dados antes de confirmar</p>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-white mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h2 className="text-xl font-semibold text-white">Detalhes do Agendamento</h2>
                </div>
                <div className="bg-white/20 rounded-full px-3 py-1">
                  <span className="text-white text-sm font-medium">Prévia</span>
                </div>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-6">
              {/* Client Information */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Informações do Cliente
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  {clientId ? (
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="text-gray-700"><strong>Nome:</strong> {clientName}</span>
                      </div>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span className="text-gray-700"><strong>Telefone:</strong> {clientPhone}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="text-gray-700"><strong>Nome:</strong> {session.user.name}</span>
                      </div>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="text-gray-700"><strong>Email:</strong> {session.user.email}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Appointment Details */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Detalhes do Agendamento
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <svg className="w-4 h-4 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm font-medium text-blue-900">Data</span>
                    </div>
                    <p className="text-lg font-semibold text-blue-900">{formattedDate}</p>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <svg className="w-4 h-4 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm font-medium text-green-900">Horário</span>
                    </div>
                    <p className="text-lg font-semibold text-green-900">{formattedTime}</p>
                  </div>
                </div>
              </div>

              {/* Professional and Procedures */}
              <div className="mb-6">
                <div className="bg-purple-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center mb-2">
                    <svg className="w-4 h-4 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-sm font-medium text-purple-900">Profissional</span>
                  </div>
                  <p className="text-lg font-semibold text-purple-900">{sellerName}</p>
                </div>

                <div className="bg-orange-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <svg className="w-4 h-4 text-orange-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                    <span className="text-sm font-medium text-orange-900">Procedimentos</span>
                  </div>
                  <p className="text-lg font-semibold text-orange-900">{procedureNames}</p>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Resumo</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>• Agendamento para {formattedDate} às {formattedTime}</p>
                  <p>• {procedureNames.split(',').length} procedimento(s) selecionado(s)</p>
                  <p>• Profissional: {sellerName}</p>
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleGoBack}
                  disabled={loading}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Voltar
                </button>
                
                <button
                  onClick={handleConfirm}
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Confirmando...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Confirmar Agendamento
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Ao confirmar, você receberá uma confirmação por email
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
}
