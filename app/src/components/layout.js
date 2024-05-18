// components/Layout.js
import React, { useState } from 'react';
import Link from 'next/link';
import NewAppointment from './newAppointment';
import { Menu, Home, MonetizationOn, Settings, EventNote } from '@mui/icons-material';

const Layout = ({ children }) => {
    const [isOpen, setIsOpen] = useState(true);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const [openDialog, setOpenDialog] = useState(false);
    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const sidebarWidth = isOpen ? 'w-64 items-center' : 'items-center w-20 p-2'; // Largura do sidebar aberto e fechado

    const linkClass = "flex items-center space-x-2 p-2 hover:bg-gray-700 hover:text-white rounded-md transition-all";
    const iconClass = "text-2xl"; // Tamanho do ícone
    const textClass = isOpen ? "inline" : "hidden"; // Esconde ou mostra o texto

    return (
        <div className="flex">
            <div className={`fixed top-0 left-0 h-full bg-white text-gray-500 ${sidebarWidth} transition-all duration-300 ease-in-out transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:${sidebarWidth}`}>
                <button onClick={toggleSidebar} className={`p-4 ${isOpen ? 'ml-auto' : 'items-center w-20 p-2'}`}>
                    <Menu className="text-2xl" />
                </button>
                <img className='w-50 h-25 mb-5 mx-auto' src="/logo.jpg" alt="Logo" />
                <nav className="flex-1">
                    <Link href="/home" className={linkClass} passHref>
                        
                            <Home className={iconClass} />
                            <span className={textClass}>Home</span>
                       
                    </Link>
                    <Link href="/financeiro"  className={linkClass}passHref>
                        
                            <MonetizationOn className={iconClass} />
                            <span className={textClass}>Financeiro</span>
                       
                    </Link>
                    <Link href='/service' className={linkClass} passHref>
                        
                            <Settings className={iconClass} />
                            <span className={textClass}>Serviços</span>
                       
                    </Link>
                    <button onClick={handleOpenDialog} className={linkClass}>
                        <EventNote className={iconClass} />
                        <span className={textClass}>Novo Agendamento</span>
                    </button>
                </nav>
                <NewAppointment open={openDialog} setOpen={setOpenDialog} />
            </div>
            <div className={`flex-1 p-4 transition-all duration-300 ease-in-out ${isOpen ? 'ml-64' : 'ml-20'}`}>
                {children}
            </div>
        </div>
    );
};

export default Layout;
