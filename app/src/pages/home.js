import App from '@/components/calendar';
import NewAppointment from '@/components/newAppointment';
import { withSessionHOC } from '@/service/auth/session';
import { useState } from 'react';


function Home() {
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };
    return (
    <div className="flex justify-center items-center">
        <App />
    </div>
  );
}

export default withSessionHOC(Home);