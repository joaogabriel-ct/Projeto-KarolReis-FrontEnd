import React, { useEffect } from 'react';
import { Button } from '@mui/material';
import { useRouter } from 'next/router';
import { getAPIClient } from "@/pages/api/axios";
import moment from 'moment';
import { Container } from '@/components/container';
import { useSession } from 'next-auth/react';
import Swal from 'sweetalert2';

export default function ConfirmAppointment() {
  const { data: session, status } = useSession();
  const router = useRouter();

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
    const api = await getAPIClient();
    try {
      // Concatena data e horário e formata para ISO
      const formattedDateTime = moment(`${date} ${time}`, 'YYYY-MM-DD HH:mm')
        .format('YYYY-MM-DDTHH:mm:ssZ');
      
      // Realiza a requisição para confirmar o agendamento
      const response = await api.post('sales/agenda/', {
        lead_id: appointmentLeadId,
        procedure_ids: procedures.split(','), // Supondo que procedures seja uma string separada por vírgulas
        seller_id: seller,
        data_init: formattedDateTime,
      });

      console.log('Agendamento confirmado', response.data);

      // Exibe SweetAlert com opção de agendar outro procedimento
      Swal.fire({
        title: 'Agendamento Confirmado!',
        text: 'Você deseja agendar outro procedimento?',
        icon: 'success',
        showCancelButton: true,
        confirmButtonText: 'Sim, agendar outro',
        cancelButtonText: 'Não, finalizar'
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
        title: 'Erro!',
        text: 'Ocorreu um erro ao tentar confirmar o agendamento.',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
    }
  };

  // Formata a data para exibição
  const formattedDate = moment(date).format('DD/MM/YYYY');

  // Enquanto a sessão não estiver carregada, exibe uma mensagem de carregamento
  if (!session) {
    return <div>Carregando...</div>;
  }

  return (
    <Container>
      <div className="flex justify-center items-center h-screen">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-2xl font-bold text-center mb-4">Confirme o Agendamento</h1>
          
          {/* Exibe os dados do cliente se estiverem presentes; caso contrário, exibe os dados do usuário da sessão */}
          {clientId ? (
            <>
              <p className="mb-2">
                <strong>Cliente:</strong> {clientName}
              </p>
              <p className="mb-2">
                <strong>Telefone:</strong> {clientPhone}
              </p>
            </>
          ) : (
            <>
              <p className="mb-2">
                <strong>Usuário:</strong> {session.user.name}
              </p>
              <p className="mb-2">
                <strong>Email:</strong> {session.user.email}
              </p>
            </>
          )}
          
          <p className="mb-2">
            <strong>Procedimentos:</strong> {procedureNames}
          </p>
          <p className="mb-2">
            <strong>Profissional:</strong> {sellerName}
          </p>
          <p className="mb-2">
            <strong>Data:</strong> {formattedDate}
          </p>
          <p className="mb-2">
            <strong>Horário:</strong> {time}
          </p>

          <div className="mt-6 text-center">
            <Button
              variant="contained"
              color="primary"
              onClick={handleConfirm}
              style={{ width: '100%', padding: '10px' }}
            >
              Agendar
            </Button>
          </div>
        </div>
      </div>
    </Container>
  );
}
