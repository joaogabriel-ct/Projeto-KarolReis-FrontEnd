import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, MenuItem } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';

// Função simulada para buscar procedimentos - substitua pela sua lógica de busca real
const fetchProcedures = async () => {
    return [
        { id: 1, name: 'Limpeza Dental' },
        { id: 2, name: 'Clareamento' },
    ];
};

// Função simulada para buscar cliente por CPF - substitua pela sua lógica de busca real
const fetchClientePorCpf = async (cpf) => {
    // Implemente a busca do cliente pela API aqui
    return cpf === '123.456.789-00' ? { nome: 'Cliente Exemplo', cpf: '123.456.789-00', instagram: '@clienteexemplo', telefoneCelular: '(11) 99999-9999' } : null;
};

// Esquema de validação Yup
const AppointmentSchema = Yup.object().shape({
    name: Yup.string().required('Nome é obrigatório'),
    cpf: Yup.string().required('CPF é obrigatório').matches(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/, 'CPF não é válido'),
    procedureId: Yup.string().required('Procedimento é obrigatório'),
    date: Yup.date().required('Data é obrigatória').nullable(),
    time: Yup.string().required('Hora é obrigatória'),
    instagram: Yup.string().optional(),
    telefoneCelular: Yup.string().required('Telefone Celular é obrigatório').matches(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, 'Telefone Celular não é válido'),
});

const NewAppointment = ({ open, setOpen }) => {
    const [procedures, setProcedures] = useState([]);

    useEffect(() => {
        const loadProcedures = async () => {
            const data = await fetchProcedures();
            setProcedures(data);
        };
        if (open) {
            loadProcedures();
        }
    }, [open]);

    const handleClose = () => {
        setOpen(false);
    };

    const handleCpfBlur = async (cpf, setFieldValue) => {
        const cliente = await fetchClientePorCpf(cpf);
        if (cliente) {
            // Atualiza os campos do formulário com os dados do cliente
            setFieldValue('name', cliente.nome);
            setFieldValue('instagram', cliente.instagram);
            setFieldValue('telefoneCelular', cliente.telefoneCelular);
            // Atualize outros campos conforme necessário
        }
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Novo Agendamento</DialogTitle>
            <Formik
                initialValues={{
                    name: '',
                    cpf: '',
                    procedureId: '',
                    date: '',
                    time: '',
                    instagram: '',
                    telefoneCelular: '',
                }}
                validationSchema={AppointmentSchema}
                onSubmit={(values, { setSubmitting }) => {
                    console.log(values);
                    setSubmitting(false);
                    Swal.fire({
                        title: 'Sucesso!',
                        text: 'Agendamento criado com sucesso!',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            handleClose();
                        }
                    });
                }}
            >
                {({ errors, touched, isSubmitting, setFieldValue }) => (
                    <Form>
                        <DialogContent>
                            <Field as={TextField}
                                autoFocus
                                margin="dense"
                                name="cpf"
                                label="CPF"
                                type="text"
                                fullWidth
                                onBlur={(e) => handleCpfBlur(e.target.value, setFieldValue)}
                                error={touched.cpf && !!errors.cpf}
                                helperText={touched.cpf && errors.cpf}
                            />
                            <Field as={TextField}
                                margin="dense"
                                name="name"
                                label="Nome"
                                type="text"
                                fullWidth
                                error={touched.name && !!errors.name}
                                helperText={touched.name && errors.name}
                            />
                            <Field as={TextField}
                                select
                                name="procedureId"
                                label="Procedimento"
                                fullWidth
                                margin="normal"
                                variant="outlined"
                                onChange={event => setFieldValue("procedureId", event.target.value)}
                                error={touched.procedureId && !!errors.procedureId}
                                helperText={touched.procedureId && errors.procedureId}
                            >
                                {procedures.map(option => (
                                    <MenuItem key={option.id} value={option.id}>
                                        {option.name}
                                    </MenuItem>
                                ))}
                            </Field>
                            <Field as={TextField}
                                margin="dense"
                                name="date"
                                label="Data"
                                type="date"
                                fullWidth
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                error={touched.date && !!errors.date}
                                helperText={touched.date && errors.date}
                            />
                            <Field as={TextField}
                                margin="dense"
                                name="time"
                                label="Hora"
                                type="time"
                                fullWidth
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                error={touched.time && !!errors.time}
                                helperText={touched.time && errors.time}
                            />
                            <Field as={TextField}
                                margin="dense"
                                name="instagram"
                                label="Instagram"
                                type="text"
                                fullWidth
                                error={touched.instagram && !!errors.instagram}
                                helperText={touched.instagram && errors.instagram}
                            />
                            <Field as={TextField}
                                margin="dense"
                                name="telefoneCelular"
                                label="Telefone Celular"
                                type="text"
                                fullWidth
                                error={touched.telefoneCelular && !!errors.telefoneCelular}
                                helperText={touched.telefoneCelular && errors.telefoneCelular}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose} disabled={isSubmitting}>Cancelar</Button>
                            <Button type="submit" disabled={isSubmitting}>Salvar</Button>
                        </DialogActions>
                    </Form>
                )}
            </Formik>
        </Dialog>
    );
};

export default NewAppointment;
