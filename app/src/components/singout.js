import { signOut } from 'next-auth/react';
import { Button } from '@mui/material';

const LogoutButton = () => {
  const handleLogout = () => {
    signOut({
      callbackUrl: '/login', 
    });
  };

  return (
    <Button onClick={handleLogout} variant="contained" color="primary">
      Logout
    </Button>
  );
};

export default LogoutButton;
