'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from 'next/image';
import Swal from 'sweetalert2';
import { Container } from '@/components/container';
import Link from 'next/link';

const schema = yup.object().shape({
  username: yup.string().required('Login não pode estar vazio.'),
  password: yup.string().required('Senha é obrigatória.'),
});

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const router = useRouter();
  const { data: session } = useSession(); // Verifica a sessão após o login
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      console.log('Tentando login com:', data.username);

      const result = await signIn('credentials', {
        username: data.username,
        password: data.password,
        redirect: false,
      });

      console.log('Resultado do login:', result);

      if (result?.error) {
        console.error('Erro no login:', result.error);
        throw new Error(result.error);
      }

      // Após o login bem-sucedido, redireciona imediatamente
      if (result?.ok) {
        console.log('Login bem-sucedido, redirecionando...');
        // Aguarda um momento para a sessão ser atualizada
        setTimeout(() => {
          router.replace('/home');
        }, 1000);
      }

    } catch (error) {
      console.error('Erro no login', error);
      Swal.fire({
        icon: 'error',
        title: 'Erro no login',
        text: error.message,
        confirmButtonText: 'Tentar novamente',
        confirmButtonColor: '#3085d6',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <section className="flex items-center justify-center min-h-screen bg-custom-pink">
        <div className="flex flex-col sm:flex-row justify-center items-center w-full max-w-4xl">
          <div className="mb-4 sm:mb-0 sm:mr-4">
            <div className="w-52 sm:w-64 lg:w-72 xl:w-80">
              <Image src="/logo.svg" alt="Logo" width={320} height={320} />
            </div>
          </div>
          <div className="w-full max-w-md">
            <div className="space-y-8 p-6 bg-white rounded-lg shadow-lg">
              <h2 className="text-3xl text-center font-bold">Login</h2>
              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="mb-4">
                  <label htmlFor="username" className="block text-gray-700 font-semibold">Nome de usuário</label>
                  <input
                    type="text"
                    id="username"
                    className={`mt-1 px-3 py-2 w-full rounded-lg border text-gray-900 placeholder-gray-500 ${errors.username ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring focus:border-blue-400`}
                    {...register('username')}
                  />
                  {errors.username && <p className="mt-1 text-red-500 text-sm">{errors.username.message}</p>}
                </div>
                <div className="mb-4">
                  <label htmlFor="password" className="block text-gray-700 font-semibold">Senha</label>
                  <input
                    type="password"
                    id="password"
                    className={`mt-1 px-3 py-2 w-full rounded-lg border text-gray-900 placeholder-gray-500 ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring focus:border-blue-400`}
                    {...register('password')}
                  />
                  {errors.password && <p className="mt-1 text-red-500 text-sm">{errors.password.message}</p>}
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`mt-4 w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-400 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading ? 'Enviando...' : 'ENVIAR'}
                </button>
              </form>
              <div className="mt-4 text-center">
                <Link href="/register"
                    className="text-blue-500 hover:underline">Ainda sem conta? Clique aqui
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Container>
  );
}
