import App from '@/components/calendar';
import NewAppointment from '@/components/newAppointment';
import { useState } from 'react';
export default function Home() {
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