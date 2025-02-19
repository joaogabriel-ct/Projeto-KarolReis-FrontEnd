import React from "react";
import { useRouter } from "next/router";
import moment from "moment";
import { getAPIClient } from "@/pages/api/axios";
import Swal from "sweetalert2";
import { useSession } from "next-auth/react";

export const AppointmentDetailsModal = ({ appointment, onClose }) => {
  const router = useRouter();
  const { data: session } = useSession();

  // Determina se o usuário é admin com base no token/sessão (ajuste a propriedade conforme o seu JSON)
  const isAdmin = session?.isAdmin;

  // Função para redirecionar para a página de "Concluir Venda" (caso ainda seja necessária)
  const handleConcludeSale = () => {
    if (appointment?.id) {
      router
        .push(`/admin/sale/${appointment.id}`)
        .then(() => console.log("Redirecionamento bem-sucedido"))
        .catch((err) => console.error("Erro ao redirecionar:", err));
    } else {
      console.error("ID do agendamento não encontrado");
    }
  };

  // Função para remarcar o agendamento (redireciona para a página de remarcação)
  const handleReschedule = () => {
    if (appointment?.id) {
      router
        .push(`/admin/reschedule/${appointment.id}`)
        .then(() => console.log("Redirecionamento para remarcar agendamento"))
        .catch((err) => console.error("Erro ao redirecionar:", err));
    } else {
      console.error("ID do agendamento não encontrado");
    }
  };

  // Função para cancelar o agendamento
  const handleCancelAppointment = async () => {
    if (!appointment?.id) {
      console.error("ID do agendamento não encontrado");
      return;
    }
    const result = await Swal.fire({
      title: "Cancelar Agendamento?",
      text: "Você tem certeza que deseja cancelar este agendamento?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, cancelar",
      cancelButtonText: "Não, manter",
    });
    if (result.isConfirmed) {
      try {
        const api = await getAPIClient();
        // Chama o endpoint para cancelar o agendamento (ajuste a rota e o método conforme sua API)
        await api.delete(`sales/agendamento/${appointment.id}`);
        Swal.fire("Cancelado!", "O agendamento foi cancelado.", "success");
        onClose();
      } catch (error) {
        console.error("Erro ao cancelar o agendamento:", error);
        Swal.fire("Erro!", "Não foi possível cancelar o agendamento.", "error");
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
      <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-1/3">
        <div className="border-b px-4 py-2 flex justify-between items-center">
          <h3 className="text-lg font-semibold">Detalhes do Agendamento</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            &times;
          </button>
        </div>
        <div className="p-4">
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700">Nome Vendedora:</h4>
            <p className="text-base text-gray-900">
              {appointment?.SELLER?.name_complete || "Não informado"}
            </p>
          </div>

          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700">Cliente:</h4>
            <p className="text-base text-gray-900">
              {appointment?.LEAD?.name || "Não informado"}
            </p>
          </div>

          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700">Telefone:</h4>
            <p className="text-base text-gray-900">
              {appointment?.LEAD?.phone_number || "Não informado"}
            </p>
          </div>

          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700">Procedimentos:</h4>
            <p className="text-base text-gray-900">
              {appointment?.procedures.join(", ") || "Não informado"}
            </p>
          </div>

          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700">Horário:</h4>
            <p className="text-base text-gray-900">
              {`${moment(appointment?.start).format("DD/MM/YYYY HH:mm")} - ${moment(
                appointment?.end
              ).format("DD/MM/YYYY HH:mm")}`}
            </p>
          </div>
        </div>

        {/* Renderiza os botões de ação somente se o usuário for admin */}
        {isAdmin && (
          <div className="border-t px-4 py-3 flex justify-between items-center">
            <button
              onClick={onClose}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded"
            >
              Fechar
            </button>
            <button
              onClick={handleReschedule}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
            >
              Remarcar
            </button>
            <button
              onClick={handleCancelAppointment}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
            >
              Cancelar Agendamento
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
