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
          const res = await axios.post('https://karolreis.online/backend/v1/login/', {
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
          if (error.response && error.response.status === 401) {
            throw new Error('Credenciais inválidas. Verifique seu usuário e senha.');
          } else {
            console.error('Authorization error:', error.message);
            throw new Error('Erro no servidor. Tente novamente mais tarde.');
          }
        }
      },
    }),
  ],
  pages: {
    signIn: '/financeiro',
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
