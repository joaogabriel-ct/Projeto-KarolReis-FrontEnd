import App from '@/components/calendar';
import { Container } from '@/components/container';
import NewAppointment from '@/components/newAppointment';

import { useState } from 'react';


function Home() {
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };
  return (
    <Container>
      <App />
    </Container>
  );
}

export default Home;