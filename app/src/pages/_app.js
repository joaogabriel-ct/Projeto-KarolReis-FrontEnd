import { useRouter } from 'next/router';
import { useSession } from '@/service/auth/session';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import '@/styles/globals.css';
import Layout from '@/components/layout';

// Função para obter o token de acesso da sessão
function getAccessToken(session) {
  return session?.accessToken || '';
}

// Componente principal do aplicativo
function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const { session, loading } = useSession();
  const [showHeader, setShowHeader] = useState(false);
  const [isSuperUser, setIsSuperUser] = useState(false);

  useEffect(() => {
    // Verifique se a sessão está carregada e se não estamos na página de login
    if (!loading && session && !router.pathname.startsWith('/login')) {
      setShowHeader(true);
      setIsSuperUser(session.user?.is_superUser || false);
    } else {
      setShowHeader(false);
      setIsSuperUser(false);
    }
  }, [session, loading, router.pathname]);

  return (
    <>
      {showHeader ? (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      ) : (
        <Component {...pageProps} />
      )}
    </>
  );
}

export default MyApp;
