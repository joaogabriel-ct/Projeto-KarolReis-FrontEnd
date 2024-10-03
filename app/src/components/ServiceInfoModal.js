import React, { useState } from 'react';
import { Modal, Card, CardContent, Typography, Button } from '@mui/material';
import ServiceDescriptionCard from './ServiceDescriptionCard';

const ServiceInfoModal = ({ procedimento }) => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <>
            <Button onClick={handleOpen} color="primary">
                
            </Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="service-info-modal"
                aria-describedby="service-info-description"
            >
                <Card variant="outlined" sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', minWidth: 300, maxWidth: '80vw', maxHeight: '80vh', overflowY: 'auto' }}>
                    <CardContent>
                        <ServiceDescriptionCard procedimento={procedimento} />
                    </CardContent>
                </Card>
            </Modal>
        </>
    );
};

export default ServiceInfoModal;
