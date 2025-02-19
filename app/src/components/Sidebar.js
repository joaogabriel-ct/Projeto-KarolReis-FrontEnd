import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
  Divider,
  Typography
} from '@mui/material';
import {
  Home,
  MonetizationOn,
  Settings,
  EventNote,
  Menu,
  PeopleAlt
} from '@mui/icons-material';
import { useSession } from 'next-auth/react';
import LogoutButton from '@/components/singout';
import Image from 'next/image';

const drawerWidth = 240;

const Sidebar = ({ children }) => {
  const { data: session, status } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Verifica se o usuário é admin com base nos dados da sessão
  const isAdmin = session?.isAdmin;

  // Drawer propriamente dito (conteúdo)
  const drawer = (
    <Box
      display="flex"
      flexDirection="column"
      height="100%"
      justifyContent="space-between"
    >
      {/* Logo e dados do usuário */}
      <Box>
        {/* Logo centralizada */}
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          mt={2}
        >
          <Image
            src="/logo.jpg"
            alt="Logo"
            width={150}
            height={60}
            style={{ objectFit: 'contain' }}
            priority
          />
        </Box>
        
        <Divider sx={{ my: 2 }} />

        {/* Dados do usuário */}
        {session?.user && (
          <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
            {/* Foto do usuário, se existir */}
            {session.user.image && (
              <Image
                src={session.user.image}
                alt="User Profile"
                width={60}
                height={60}
                style={{ borderRadius: '50%', objectFit: 'cover' }}
              />
            )}
            <Typography variant="body1" sx={{ mt: 1, fontWeight: 'bold' }}>
              {session.user.name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {session.user.email}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Lista de navegação */}
      <Box>
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
              <ListItem button component="a" href="/admin/clientes">
                <ListItemIcon>
                  <PeopleAlt />
                </ListItemIcon>
                <ListItemText primary="Clientes" />
              </ListItem>
            </>
          )}
          <ListItem>
            <LogoutButton />
          </ListItem>
        </List>
      </Box>
    </Box>
  );

  // Se não estiver logado ou estiver carregando, não exibe nada
  if (status === 'loading' || status === 'unauthenticated') {
    return null;
  }

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Ícone de menu (aparece em telas pequenas) */}
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={handleDrawerToggle}
        sx={{ mr: 2, display: { lg: 'none' } }}
      >
        <Menu />
      </IconButton>

      {/* Drawer temporário para mobile */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: 'block', lg: 'none' } }}
      >
        <Box
          sx={{
            width: drawerWidth,
            boxSizing: 'border-box',
            p: 2
          }}
        >
          {drawer}
        </Box>
      </Drawer>

      {/* Drawer permanente em telas grandes */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          display: { xs: 'none', lg: 'block' },
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
            p: 2
          }
        }}
        open
      >
        {drawer}
      </Drawer>

      {/* Conteúdo principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { lg: `calc(100% - ${drawerWidth}px)` }
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Sidebar;
