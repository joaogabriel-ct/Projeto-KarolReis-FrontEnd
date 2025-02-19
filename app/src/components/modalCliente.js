import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { getAPIClient } from '@/pages/api/axios';

export default function ClientModal({ client, onClose, onSuccess }) {
  // Estado do formulário com os campos conforme o JSON
  const [formData, setFormData] = useState({
    name: client.name || '',
    cpf: client.cpf || '',
    phone_number: client.phone_number || '',
    instagram: client.instagram || '',
    birthday: client.birthday || '',
    adress: client.adress || '',
    // Mantém o ID do usuário conforme o JSON (não será editável)
    user: client.user?.id || '',
  });

  // Atualiza os valores do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Atualiza os dados do cliente via PUT
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const api = await getAPIClient();
      await api.put(`lead/${client.id}/`, formData);
      Swal.fire('Sucesso!', 'Cliente atualizado com sucesso.', 'success');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erro ao atualizar o cliente:', error);
      Swal.fire('Erro', 'Não foi possível atualizar o cliente.', 'error');
    }
  };

  // Exclui o cliente via DELETE, com confirmação
  const handleDelete = async () => {
    const confirmResult = await Swal.fire({
      title: 'Tem certeza?',
      text: 'Você deseja excluir este cliente?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Cancelar',
    });

    if (confirmResult.isConfirmed) {
      try {
        const api = await getAPIClient();
        await api.delete(`lead/${client.id}/`);
        Swal.fire('Excluído!', 'O cliente foi excluído.', 'success');
        onSuccess();
        onClose();
      } catch (error) {
        console.error('Erro ao excluir o cliente:', error);
        Swal.fire('Erro', 'Não foi possível excluir o cliente.', 'error');
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-md w-96">
        <h2 className="text-xl mb-4">Editar Cliente</h2>
        <form onSubmit={handleUpdate}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Nome do Cliente
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              CPF
            </label>
            <input
              type="text"
              name="cpf"
              value={formData.cpf}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Telefone
            </label>
            <input
              type="text"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Instagram
            </label>
            <input
              type="text"
              name="instagram"
              value={formData.instagram}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Data de Nascimento
            </label>
            <input
              type="date"
              name="birthday"
              value={formData.birthday}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Endereço
            </label>
            <input
              type="text"
              name="adress"
              value={formData.adress}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          
          {/* Campo Usuário vindo diretamente do JSON (somente leitura) */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Usuário
            </label>
            <input
              type="text"
              value={`${client.user?.username} (${client.user?.email})`}
              disabled
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-gray-100"
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Excluir
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Salvar
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
