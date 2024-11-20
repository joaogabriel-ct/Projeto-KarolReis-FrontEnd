import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Link from 'next/link';

export default function Register() {
  const [formData, setFormData] = useState({
    user: {
      username: '',
      email: '',
      password: '',
    },
    cpf: '',
    name: '',
    phone_number: '',
    instagram: '',
    birthday: '',
    doenca: '',
    adress: '',
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
      const response = await axios.post('lead/', formData);
      Swal.fire('Sucesso!', 'Lead cadastrado com sucesso!', 'success');
      setFormData({
        user: {
          username: '',
          email: '',
          password: '',
        },
        cpf: '',
        name: '',
        phone_number: '',
        instagram: '',
        birthday: '',
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
        <h2 className="text-2xl font-semibold text-center mb-6">Registro de Lead</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campos do Usuário */}
          <h3 className="text-xl font-medium">Informações do Usuário</h3>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Nome de Usuário</label>
            <input
              type="text"
              name="user.username"
              value={formData.user.username}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-lg"
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
              className="w-full p-2 border border-gray-300 rounded-lg"
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
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Campos do Lead */}
          <h3 className="text-xl font-medium">Informações do Lead</h3>
          <div>
            <label htmlFor="cpf" className="block text-sm font-medium text-gray-700">CPF</label>
            <input
              type="text"
              name="cpf"
              value={formData.cpf}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
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
            <label htmlFor="instagram" className="block text-sm font-medium text-gray-700">Instagram</label>
            <input
              type="text"
              name="instagram"
              value={formData.instagram}
              onChange={handleChange}
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
          <div>
            <label htmlFor="doenca" className="block text-sm font-medium text-gray-700">Doenças</label>
            <input
              type="text"
              name="doenca"
              value={formData.doenca}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label htmlFor="adress" className="block text-sm font-medium text-gray-700">Endereço</label>
            <input
              type="text"
              name="adress"
              value={formData.adress}
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
            <Link href="/login"
             className="text-blue-500 hover:underline">Voltar a tela de login.
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
