import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';

export default NextAuth({
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        try {
          const res = await axios.post('http://localhost:8000/api/v1/login/', {
            username: credentials.username,
            password: credentials.password,
          });

          const token = res.data.access;
          const decodedToken = parseJwt(token);  // Decodifica o JWT

          const user = {
            token,
            refreshToken: res.data.refresh,
            isAdmin: decodedToken?.isAdmin,
            lead_id: decodedToken?.lead_id,
            user_id: decodedToken?.user_id,
            name: decodedToken?.name,
            email: decodedToken?.email
          };

          if (user) {
            return user;
          } else {
            return null;
          }
        } catch (error) {
          console.error('Authorization error:', error);
          throw new Error('Invalid credentials');
        }
      }
    })
  ],
  pages: {
    signIn: '/financeiro',
  },
  callbacks: {
    async jwt({ token, user }) {
      // Ao fazer login, armazena o token JWT e as permissões no token
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
      // Passa as informações para a sessão do usuário
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.isAdmin = token.isAdmin;

      // Adicionando as informações do usuário à sessão
      session.user = {
        id: token.id,
        lead_id: token.lead_id,
        name: token.name,
        email: token.email,
        isAdmin: token.isAdmin
      };

      return session;
    }
  },
  session: {
    jwt: true
  },
  secret: process.env.NEXTAUTH_SECRET
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
