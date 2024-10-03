import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, Box } from '@mui/material';
import { Home, MonetizationOn, Settings, EventNote, Menu } from '@mui/icons-material';
import { useSession } from 'next-auth/react'; // Importa o hook do next-auth para verificar sessão
import LogoutButton from '@/components/singout'; // Importando o botão de logout

const drawerWidth = 240; // Define a largura do Drawer

const Sidebar = ({ children }) => {
    const { data: session, status } = useSession(); // Obtém os dados da sessão
    const [mobileOpen, setMobileOpen] = useState(false);
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    // Verifica se o usuário é admin com base nos dados da sessão
    const isAdmin = session?.isAdmin;

    const drawer = (
        <div>
            <div className="p-4 flex items-center justify-between">
                <img className='w-50 h-20 mx-auto' src="/logo.jpg" alt="Logo" />
            </div>
            <List>
                <ListItem button component="a" href="/home">
                    <ListItemIcon>
                        <Home />
                    </ListItemIcon>
                    <ListItemText primary="Home" />
                </ListItem>
                <ListItem button component="a" href="/services">
                    <ListItemIcon>
                        <EventNote />
                    </ListItemIcon>
                    <ListItemText primary="Novo Agendamento" />
                </ListItem>
                {isAdmin && (
                    <>
                        <ListItem button component="a" href="/admin/financeiro">
                            <ListItemIcon>
                                <MonetizationOn />
                            </ListItemIcon>
                            <ListItemText primary="Financeiro" />
                        </ListItem>
                        <ListItem button component="a" href="/admin/service">
                            <ListItemIcon>
                                <Settings />
                            </ListItemIcon>
                            <ListItemText primary="Serviços" />
                        </ListItem>
                    </>
                )}
                <ListItem>
                    <LogoutButton />
                </ListItem>
            </List>
        </div>
    );

    if (status === 'loading' || status === 'unauthenticated') {
        return null;
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, display: { lg: 'none' } }}
            >
                <Menu />
            </IconButton>
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
                sx={{ display: { xs: 'block', lg: 'none' } }}
            >
                {drawer}
            </Drawer>
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
                    display: { xs: 'none', lg: 'block' }
                }}
                open
            >
                {drawer}
            </Drawer>
            {/* Ajusta o conteúdo principal para não ser sobreposto pelo Drawer */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { lg: `calc(100% - ${drawerWidth}px)` }, // Espaço que sobrou com o Drawer
                }}
            >
                {children} {/* Aqui vai o conteúdo da página */}
            </Box>
        </Box>
    );
};

export default Sidebar;
