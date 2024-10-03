import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Verifica se é uma rota administrativa
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');

  // Verifica se o usuário é admin
  if (isAdminRoute && (!token || !token.isAdmin)) {
    return NextResponse.redirect(new URL('/403', req.url));
  }  

  // Caso contrário, prossegue com a requisição
  return NextResponse.next();
}

export const config = {
  matcher: ['/home', '/admin/:path*', '/agendamento'],  // Rotas protegidas
};