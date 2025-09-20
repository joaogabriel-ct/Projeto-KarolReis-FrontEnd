import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import { useNotifications } from './NotificationSystem';

const Header = ({ onMenuClick, session }) => {
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { notificationCount, showInfo } = useNotifications();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  const getPageTitle = () => {
    const path = router.pathname;
    const titles = {
      '/home': 'Dashboard',
      '/services': 'Novo Agendamento',
      '/admin/financeiro': 'Financeiro',
      '/admin/service': 'Serviços',
      '/admin/clientes': 'Clientes',
      '/admin/sale': 'Vendas',
      '/admin/venda': 'Vendas',
      '/agendamento': 'Calendário',
      '/scheduling': 'Agendamentos'
    };
    return titles[path] || 'Karol Reis';
  };

  // Ícones SVG inline
  const MenuIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );

  const SearchIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );

  const BellIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM10.5 3.75a6 6 0 00-6 6v7.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 17.25v-7.5a6 6 0 00-6-6z" />
    </svg>
  );

  const UserIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );

  const SettingsIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );

  const LogOutIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  );

  const ChevronDownIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Lado esquerdo */}
          <div className="flex items-center space-x-4">
            {/* Botão menu mobile */}
            <button
              id="sidebar-toggle"
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <MenuIcon />
            </button>

            {/* Logo */}
            <div className="flex items-center space-x-3">
              <Image
                src="/logo.jpg"
                alt="Karol Reis"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <div className="hidden sm:block">
                <h1 className="text-lg font-semibold text-gray-900">
                  {getPageTitle()}
                </h1>
                <p className="text-xs text-gray-500">
                  Sistema de Gestão
                </p>
              </div>
            </div>
          </div>

          {/* Lado direito */}
          <div className="flex items-center space-x-4">
            {/* Busca */}
            <div className="hidden md:block relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon />
              </div>
              <input
                type="text"
                placeholder="Buscar..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
              />
            </div>

            {/* Notificações */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsNotificationsOpen(!isNotificationsOpen);
                  showInfo('Notificações', 'Sistema de notificações ativo');
                }}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 relative"
              >
                <BellIcon />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 rounded-full bg-red-500 text-white text-xs font-medium">
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </span>
                )}
              </button>

              {/* Dropdown notificações */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-gray-900 mb-3">
                      Notificações
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3 p-3 rounded-md bg-blue-50">
                        <div className="flex-shrink-0">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-blue-800">
                            Novo agendamento confirmado
                          </p>
                          <p className="text-xs text-blue-600 mt-1">
                            Há 5 minutos
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3 p-3 rounded-md bg-green-50">
                        <div className="flex-shrink-0">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-green-800">
                            Pagamento recebido
                          </p>
                          <p className="text-xs text-green-600 mt-1">
                            Há 1 hora
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Perfil do usuário */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <div className="relative">
                  {session?.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt="Profile"
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                      <UserIcon />
                    </div>
                  )}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-gray-900">
                    {session?.user?.name || 'Usuário'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {session?.user?.email || 'usuario@email.com'}
                  </p>
                </div>
                <ChevronDownIcon />
              </button>

              {/* Dropdown perfil */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        router.push('/admin/profile');
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <UserIcon />
                      <span className="ml-3">Perfil</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        router.push('/admin/settings');
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <SettingsIcon />
                      <span className="ml-3">Configurações</span>
                    </button>
                    <hr className="my-1" />
                    <button
                      onClick={handleSignOut}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOutIcon />
                      <span className="ml-3">Sair</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Fechar dropdowns quando clicar fora */}
      {(isProfileOpen || isNotificationsOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsProfileOpen(false);
            setIsNotificationsOpen(false);
          }}
        />
      )}
    </header>
  );
};

export default Header; 