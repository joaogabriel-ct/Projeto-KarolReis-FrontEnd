import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Se não há token, redirecionar para login
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    const isAdmin = token.isAdmin;

    // Redirecionamentos baseados no tipo de usuário
    if (pathname === '/') {
      // Se for admin e estiver na home, redirecionar para dashboard
      if (isAdmin) {
        return NextResponse.redirect(new URL('/home', req.url));
      }
      // Se não for admin, permanecer na home
      return NextResponse.next();
    }

    if (pathname === '/home') {
      // Se não for admin e tentar acessar dashboard, redirecionar para home
      if (!isAdmin) {
        return NextResponse.redirect(new URL('/', req.url));
      }
      // Se for admin, permitir acesso ao dashboard
      return NextResponse.next();
    }

    // Para rotas admin, verificar se é admin
    if (pathname.startsWith('/admin/')) {
      if (!isAdmin) {
        return NextResponse.redirect(new URL('/', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|login).*)'],
};