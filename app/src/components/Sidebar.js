import React from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { signOut } from 'next-auth/react';

const Sidebar = ({ isOpen, onClose, session }) => {
  const router = useRouter();
  const isAdmin = session?.isAdmin || session?.user?.isAdmin;

  // Ícones SVG inline
  const HomeIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );

  const CalendarIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );

  const UsersIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
    </svg>
  );

  const DollarSignIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
    </svg>
  );

  const SettingsIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );

  const LogOutIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  );

  const XIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );

  const UserIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );

  const BarChart3Icon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );

  const FileTextIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );

  const navigation = [
    {
      name: isAdmin ? 'Dashboard' : 'Home',
      href: isAdmin ? '/home' : '/',
      icon: HomeIcon,
      current: isAdmin ? router.pathname === '/home' : router.pathname === '/'
    },
    {
      name: 'Calendário',
      href: '/agendamento',
      icon: CalendarIcon,
      current: router.pathname === '/agendamento'
    },
    {
      name: 'Novo Agendamento',
      href: '/scheduling',
      icon: CalendarIcon,
      current: router.pathname === '/scheduling'
    }
  ];

  const adminNavigation = [
    {
      name: 'Financeiro',
      href: '/admin/financeiro',
      icon: DollarSignIcon,
      current: router.pathname === '/admin/financeiro'
    },
    {
      name: 'Clientes',
      href: '/admin/clientes',
      icon: UsersIcon,
      current: router.pathname === '/admin/clientes'
    },
    {
      name: 'Serviços',
      href: '/admin/service',
      icon: SettingsIcon,
      current: router.pathname === '/admin/service'
    },
    {
      name: 'Relatórios',
      href: '/admin/reports',
      icon: BarChart3Icon,
      current: router.pathname === '/admin/reports'
    },
    {
      name: 'Vendas',
      href: '/admin/sale',
      icon: FileTextIcon,
      current: router.pathname.includes('/admin/sale') || router.pathname.includes('/admin/venda')
    }
  ];

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  const handleNavigation = (href) => {
    router.push(href);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Sidebar para desktop */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-white border-r border-gray-200">
            {/* Logo */}
            <div className="flex items-center h-16 flex-shrink-0 px-4 bg-gradient-to-r from-red-500 to-red-600">
              <Image
                src="/logo.jpg"
                alt="Karol Reis"
                width={120}
                height={48}
                className="rounded-lg"
              />
            </div>

            {/* Navegação */}
            <div className="flex-1 flex flex-col overflow-y-auto">
              <nav className="flex-1 px-2 py-4 space-y-1">
                {/* Navegação principal */}
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.name}
                      onClick={() => handleNavigation(item.href)}
                      className={`${
                        item.current
                          ? 'bg-red-100 text-red-900 border-r-2 border-red-500'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      } group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-all duration-200 w-full text-left`}
                    >
                      <Icon
                        className={`${
                          item.current ? 'text-red-500' : 'text-gray-400 group-hover:text-gray-500'
                        } mr-3 flex-shrink-0 h-5 w-5`}
                      />
                      {item.name}
                    </button>
                  );
                })}

                {/* Separador */}
                {isAdmin && (
                  <div className="pt-4 pb-2">
                    <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Administração
                    </h3>
                  </div>
                )}

                {/* Navegação admin */}
                {isAdmin &&
                  adminNavigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.name}
                        onClick={() => handleNavigation(item.href)}
                        className={`${
                          item.current
                            ? 'bg-red-100 text-red-900 border-r-2 border-red-500'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        } group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-all duration-200 w-full text-left`}
                      >
                        <Icon
                          className={`${
                            item.current ? 'text-red-500' : 'text-gray-400 group-hover:text-gray-500'
                          } mr-3 flex-shrink-0 h-5 w-5`}
                        />
                        {item.name}
                      </button>
                    );
                  })}
              </nav>
            </div>

            {/* Perfil do usuário */}
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
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
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-700">
                    {session?.user?.name || 'Usuário'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {isAdmin ? 'Administrador' : 'Usuário'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar para mobile */}
      <div
        id="sidebar"
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header mobile */}
          <div className="flex items-center justify-between h-16 px-4 bg-gradient-to-r from-red-500 to-red-600">
            <Image
              src="/logo.jpg"
              alt="Karol Reis"
              width={120}
              height={48}
              className="rounded-lg"
            />
            <button
              onClick={onClose}
              className="p-2 rounded-md text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-white"
            >
              <XIcon />
            </button>
          </div>

          {/* Navegação mobile */}
          <div className="flex-1 flex flex-col overflow-y-auto">
            <nav className="flex-1 px-2 py-4 space-y-1">
              {/* Navegação principal */}
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.name}
                    onClick={() => handleNavigation(item.href)}
                    className={`${
                      item.current
                        ? 'bg-red-100 text-red-900 border-r-2 border-red-500'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    } group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-all duration-200 w-full text-left`}
                  >
                    <Icon
                      className={`${
                        item.current ? 'text-red-500' : 'text-gray-400 group-hover:text-gray-500'
                      } mr-3 flex-shrink-0 h-5 w-5`}
                    />
                    {item.name}
                  </button>
                );
              })}

              {/* Separador */}
              {isAdmin && (
                <div className="pt-4 pb-2">
                  <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Administração
                  </h3>
                </div>
              )}

              {/* Navegação admin */}
              {isAdmin &&
                adminNavigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.name}
                      onClick={() => handleNavigation(item.href)}
                      className={`${
                        item.current
                          ? 'bg-red-100 text-red-900 border-r-2 border-red-500'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      } group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-all duration-200 w-full text-left`}
                    >
                      <Icon
                        className={`${
                          item.current ? 'text-red-500' : 'text-gray-400 group-hover:text-gray-500'
                        } mr-3 flex-shrink-0 h-5 w-5`}
                      />
                      {item.name}
                    </button>
                  );
                })}
            </nav>
          </div>

          {/* Perfil do usuário mobile */}
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex items-center w-full">
              <div className="flex-shrink-0">
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
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-700">
                  {session?.user?.name || 'Usuário'}
                </p>
                <p className="text-xs text-gray-500">
                  {isAdmin ? 'Administrador' : 'Usuário'}
                </p>
              </div>
              <button
                onClick={handleSignOut}
                className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <LogOutIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
