import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';
import { jwtVerify } from 'jose';

export default NextAuth({
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        try {
          // Faz a solicitação para autenticação no backend
          const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/backend/v1';
          const res = await axios.post(`${API_BASE_URL}/auth/login/`, {
            username: credentials.username,
            password: credentials.password,
          });

          const token = res.data.access;
          const decodedToken = await parseJwt(token);

          const user = {
            token,
            refreshToken: res.data.refresh,
            isAdmin: decodedToken?.isAdmin,
            lead_id: decodedToken?.lead_id,
            user_id: decodedToken?.user_id,
            name: decodedToken?.name,
            email: decodedToken?.email,
          };

          if (user) {
            return user;
          } else {
            return null;
          }
        } catch (error) {
          // Melhoria na tratativa de erros
          console.error('Erro completo:', error);
          
          if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
            
            if (error.response.status === 401) {
              throw new Error('Credenciais inválidas. Verifique seu usuário e senha.');
            } else if (error.response.status === 400) {
              const errorMessage = error.response.data?.detail || error.response.data?.error || 'Dados inválidos';
              throw new Error(errorMessage);
            } else {
              throw new Error(`Erro no servidor (${error.response.status}). Tente novamente mais tarde.`);
            }
          } else if (error.request) {
            console.error('Request error:', error.request);
            throw new Error('Não foi possível conectar ao servidor. Verifique se o backend está rodando.');
          } else {
            console.error('Error message:', error.message);
            throw new Error('Erro inesperado. Tente novamente mais tarde.');
          }
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.token;
        token.refreshToken = user.refreshToken;
        token.isAdmin = user.isAdmin;
        token.id = user.user_id;
        token.lead_id = user.lead_id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.isAdmin = token.isAdmin;

      session.user = {
        id: token.id,
        lead_id: token.lead_id,
        name: token.name,
        email: token.email,
        isAdmin: token.isAdmin, // Adicionar também no user object
      };

      return session;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24 * 7, // 7 dias
    updateAge: 60 * 60 * 24, // Atualizar sessão a cada 24 horas
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: false,
});


function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = Buffer.from(base64, 'base64').toString('utf-8');
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Error decoding JWT token:', e);
    return null;
  }
}
