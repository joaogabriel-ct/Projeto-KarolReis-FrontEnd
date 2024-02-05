import React, { useState } from 'react';
import Link from 'next/link';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import HomeIcon from '@mui/icons-material/Home';
import MenuIcon from '@mui/icons-material/Menu';
import EventNoteIcon from '@mui/icons-material/EventNote';
import NewAppointment from './newAppointment';

function Sidebar() {
    const [isOpen, setIsOpen] = useState(true);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const [openDialog, setOpenDialog] = useState(false)
    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const sidebarWidth = isOpen ? '250px' : '70px'; // Largura do sidebar aberto e fechado

    const linkClass = "flex items-center space-x-2 p-2 hover:bg-gray-700 hover:text-white rounded-md transition-all";
    const iconClass = "text-2xl"; // Tamanho do ícone
    const textClass = isOpen ? "inline" : "hidden"; // Esconde ou mostra o texto
    const listSx = {
        display: isOpen ? 'block' : 'flex',
        flexDirection: isOpen ? 'column' : 'row',
        justifyContent: isOpen ? 'flex-start' : 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
    };

    return (
        <div>
            <Drawer
                variant="permanent"
                sx={{
                    width: sidebarWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: sidebarWidth,
                        boxSizing: 'border-box',
                    },
                }}
            >
                <IconButton onClick={toggleSidebar} sx={{ ml: isOpen ? 'auto' : '0' }}>
                    <MenuIcon className="text-2xl" />
                </IconButton>
                <img className='w-50 h-50 mb-5' src="/logo.jpg" alt="Logo" />
                <List sx={listSx}>
                    <Link href="/home" passHref>
                        <ListItem className={linkClass}>
                            <ListItemIcon>
                                <HomeIcon className={iconClass} />
                            </ListItemIcon>
                            <ListItemText primary={<span className={textClass}>Home</span>} />
                        </ListItem>
                    </Link>
                    <Link href="/financeiro" passHref>
                        <ListItem className={linkClass}>
                            <ListItemIcon>
                                <MonetizationOnIcon className={iconClass} />
                            </ListItemIcon>
                            <ListItemText primary={<span className={textClass}>Financeiro</span>} />
                        </ListItem>
                    </Link>
                    <Link href='/service' passHref>
                        <ListItem className={linkClass}>
                            <ListItemIcon>
                                <SettingsIcon className={iconClass} />
                            </ListItemIcon>
                            <ListItemText primary={<span className={textClass}>Serviços</span>} />
                        </ListItem>
                    </Link>

                    <ListItem button onClick={handleOpenDialog} className="flex items-center space-x-2 p-2 hover:bg-gray-700 hover:text-white rounded-md transition-all">
                        <ListItemIcon>
                            <EventNoteIcon className="text-2xl" />
                        </ListItemIcon>
                        <ListItemText primary={<span className={isOpen ? "inline" : "hidden"}>Novo Agendamento</span>} />
                    </ListItem>


                </List>
            </Drawer>
            <NewAppointment open={openDialog} setOpen={setOpenDialog} />
        </div>
    );
}

export default Sidebar;
