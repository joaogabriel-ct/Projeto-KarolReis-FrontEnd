import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import LoadingSpinner from '@/components/LoadingSpinner';

const Layout = ({ children }) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Rotas que não precisam de layout completo
  const noLayoutRoutes = ['/login', '/register'];
  const shouldShowLayout = !noLayoutRoutes.includes(router.pathname);

  // Loading state para transições de página
  useEffect(() => {
    const handleStart = () => setIsLoading(true);
    const handleComplete = () => setIsLoading(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  // Fechar sidebar em mobile quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isSidebarOpen && window.innerWidth < 1024) {
        const sidebar = document.getElementById('sidebar');
        const toggleButton = document.getElementById('sidebar-toggle');
        
        if (sidebar && !sidebar.contains(event.target) && 
            toggleButton && !toggleButton.contains(event.target)) {
          setIsSidebarOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSidebarOpen]);

  // Se não deve mostrar layout, retorna apenas o conteúdo
  if (!shouldShowLayout) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100">
        {children}
      </div>
    );
  }

  // Se está carregando a sessão, mostra loading
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Se não está autenticado, redireciona para login
  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100">
      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {/* Layout principal */}
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)}
          session={session}
        />

        {/* Conteúdo principal */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <Header 
            onMenuClick={() => setIsSidebarOpen(true)}
            session={session}
          />

          {/* Conteúdo da página */}
          <main className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="container-custom py-6">
              {children}
            </div>
          </main>
        </div>
      </div>

      {/* Overlay para mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;
