import React, { useState } from 'react';
import Link from 'next/link';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import HomeIcon from '@mui/icons-material/Home';

function Sidebar() {
    const [isOpen, setIsOpen] = useState(true);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const sidebarClass = isOpen ? 'w-64' : 'w-20'; // Ajuste as larguras conforme necessário
    const linkClass = "flex items-center space-x-2 p-2 hover:bg-gray-700 hover:text-white rounded-md transition-all";
    const iconClass = "text-2xl"; // Tamanho do ícone
    const textClass = isOpen ? "inline" : "hidden"; // Esconde ou mostra o texto

    return (
        <div className={`bg-custom-pink text ${sidebarClass} min-h-screen p-5`}>
            <img className='w-50 h-50 mb-5' src="/logo.jpg" alt="Logo" />
            <Link href="/home" className={linkClass}>
                <HomeIcon className={iconClass}/>
                <span className={textClass}>Home</span>
            </Link>
            <Link href="/financeiro" className={linkClass}>
                <MonetizationOnIcon className={iconClass}/>
                <span className={textClass}>Financeiro</span>
            </Link>
            <Link href='/service' className={linkClass}>
                <SettingsIcon className={iconClass}/>
                <span className={textClass}>Serviços</span>
            </Link>
            <Link href="/pessoas" className={linkClass}>
                <PersonIcon className={iconClass}/>
                <span className={textClass}>Pessoas</span>
            </Link>
        </div>
    );
}

export default Sidebar;
