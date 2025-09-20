import { useState } from 'react';
import Swal from 'sweetalert2';
import Link from 'next/link';
import { getAPIClient } from "@/pages/api/axios";

export default function Register() {
  const [formData, setFormData] = useState({
    user: {
      username: '',
      email: '',
      password: '',
    },
    name: '',
    phone_number: '',
    birthday: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith('user.')) {
      setFormData({
        ...formData,
        user: {
          ...formData.user,
          [name.split('.')[1]]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Utiliza a abstração de API configurada (getAPIClient)
      const api = await getAPIClient();
      const response = await api.post('people/lead/', formData);
      Swal.fire('Sucesso!', 'Lead cadastrado com sucesso!', 'success');

      // Limpa o formulário (ajuste os campos conforme necessário)
      setFormData({
        user: {
          username: '',
          email: '',
          password: '',
        },
        name: '',
        phone_number: '',
        birthday: '',
        cpf: '',
        instagram: '',
        doenca: '',
        adress: '',
      });
    } catch (error) {
      console.error('Erro ao cadastrar lead:', error);
      Swal.fire('Erro!', 'Falha ao cadastrar lead. Verifique os dados.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-6">Registro da cliente</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campos do Usuário */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Nome de Usuário</label>
            <input
              type="text"
              name="user.username"
              value={formData.user.username}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="user.email"
              value={formData.user.email}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Senha</label>
            <input
              type="password"
              name="user.password"
              value={formData.user.password}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Campos do Lead */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome Completo</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">Telefone</label>
            <input
              type="text"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label htmlFor="birthday" className="block text-sm font-medium text-gray-700">Data de Nascimento</label>
            <input
              type="date"
              name="birthday"
              value={formData.birthday}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 focus:outline-none"
            disabled={loading}
          >
            {loading ? 'Cadastrando...' : 'Registrar'}
          </button>
          <div className="mt-4 text-center">
            <Link href="/login" className="text-blue-500 hover:underline">
              Voltar a tela de login.
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
