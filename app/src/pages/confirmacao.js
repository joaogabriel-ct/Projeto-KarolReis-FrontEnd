import React, { useEffect } from 'react';
import { Button } from '@mui/material';
import { useRouter } from 'next/router';
import { getAPIClient } from "@/pages/api/axios";
import moment from 'moment';
import { Container } from '@/components/container';
import { useSession } from 'next-auth/react';
import Swal from 'sweetalert2'; // Importando o SweetAlert

export default function ConfirmAppointment() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { procedures, procedureNames, seller, sellerName, date, time } = router.query;

  // Verifica se o usuário está autenticado
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/login');
    }
  }, [status]);

  const handleConfirm = async () => {
    const api = await getAPIClient();
    try {
      const formattedDateTime = moment(`${date} ${time}`, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DDTHH:mm:ssZ');
      const response = await api.post('/agenda/', {
        lead_id: session?.user?.lead_id ? session?.user?.lead_id : session?.user?.id,
        procedure_ids: procedures.split(','),
        seller_id: seller,
        data_init: formattedDateTime,
      });

      console.log('Agendamento confirmado', response.data);

      // SweetAlert de sucesso com opção de agendar outro procedimento
      Swal.fire({
        title: 'Agendamento Confirmado!',
        text: 'Você deseja agendar outro procedimento?',
        icon: 'success',
        showCancelButton: true,
        confirmButtonText: 'Sim, agendar outro',
        cancelButtonText: 'Não, finalizar'
      }).then((result) => {
        if (result.isConfirmed) {
          // Redireciona para a página de agendamento para um novo procedimento
          router.push('/services');
        } else {
          // Redireciona para a página de sucesso
          router.push('/home');
        }
      });

    } catch (error) {
      console.error('Erro ao confirmar agendamento:', error);

      // SweetAlert de erro
      Swal.fire({
        title: 'Erro!',
        text: 'Ocorreu um erro ao tentar confirmar o agendamento.',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
    }
  };

  // Formatando a data para um formato mais legível para exibição
  const formattedDate = moment(date).format('DD/MM/YYYY');

  // Verifica se os dados da sessão estão disponíveis
  if (!session) {
    return <div>Carregando...</div>;
  }

  return (
    <Container>
      <div className="flex justify-center items-center h-screen">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-2xl font-bold text-center mb-4">Confirme o Agendamento</h1>

          <p className="mb-2">
            <strong>Usuário:</strong> {session.user.name}
          </p>
          <p className="mb-2">
            <strong>Email:</strong> {session.user.email}
          </p>
          <p className="mb-2">
            <strong>Procedimentos:</strong> {procedureNames}
          </p>
          <p className="mb-2">
            <strong>Vendedor:</strong> {sellerName}
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
