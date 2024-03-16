import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, MenuItem, Select, TextareaAutosize } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import InputMask from 'react-input-mask';
import * as Yup from 'yup';
import Swal from 'sweetalert2';

// Suposição de busca de procedimentos
const fetchProcedures = async () => {
    try {
        const response = await fetch('http://localhost:8000/api/v1/procedure/');
        if (!response.ok) throw new Error('Falha ao buscar procedimentos');
        return await response.json();
    } catch (error) {
        console.error("Erro ao buscar procedimentos:", error);
        return [];
    }
};

// Suposição de busca de cliente por CPF
const fetchClientePorCpf = async (cpf) => {
    try {
        const response = await fetch(`http://localhost:8000/api/v1/lead/?cpf=${cpf}`);
        if (!response.ok) throw new Error('Falha ao buscar cliente por CPF');
        const data = await response.json();
        return data.length > 0 ? data[0] : null;
    } catch (error) {
        console.error("Erro ao buscar cliente:", error);
        return null;
    }
};

// Validação do formulário com Yup
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
    const [openNewLeadDialog, setOpenNewLeadDialog] = useState(false);
    const [cpfNotFound, setCpfNotFound] = useState(''); // Adiciona este estado

    useEffect(() => {
        const loadProcedures = async () => {
            const data = await fetchProcedures();
            setProcedures(data);
        };
        if (open) loadProcedures();
    }, [open]);

    const handleClose = () => setOpen(false);

    const handleCpfBlur = async (event, setFieldValue, setSubmitting) => {
        const cpf = event.target.value.replace(/\D/g, ''); // Remove a formatação do CPF
        const cliente = await fetchClientePorCpf(cpf);
        if (cliente) {
            setFieldValue('name', cliente.name);
            setFieldValue('instagram', cliente.instagram);
            setFieldValue('telefoneCelular', cliente.phone_number);
        } else {
            setCpfNotFound(cpf); // Armazena o CPF não encontrado
            setOpenNewLeadDialog(true); // Abre o dialog de novo lead
        }
    };

    return (
        <>
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
                    onSubmit={async (values, { setSubmitting }) => {
                        const leadData = await fetchClientePorCpf(values.cpf.replace(/\D/g, ''));
                        if (!leadData) {
                            Swal.fire('Erro', 'Cliente não encontrado e/ou não foi possível criar um novo.', 'error');
                            setSubmitting(false);
                            return;
                        }
                        const payload = {
                            lead_id: leadData.id,
                            seller_id: 1,
                            procedure_id: values.procedureId,
                            date: values.date,
                            time: values.time,
                        };
                        try {
                            const response = await fetch('http://localhost:8000/api/v1/agenda/', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(payload),
                            });

                            if (!response.ok) {
                                throw new Error('Falha ao criar agendamento');
                            }

                            await response.json();
                            Swal.fire('Sucesso!', 'Agendamento criado com sucesso!', 'success').then(() => handleClose());
                        } catch (error) {
                            console.error('Erro ao salvar agendamento:', error);
                            Swal.fire('Erro!', 'Não foi possível criar o agendamento.', 'error');
                        }

                        setSubmitting(false);
                    }}
                >
                    {({ errors, touched, isSubmitting, setFieldValue }) => (
                        <Form>
                            <DialogContent>
                                <Field name="cpf">
                                    {({ field, form }) => (
                                        <InputMask mask="999.999.999-99" value={field.value} onChange={field.onChange} onBlur={(event) => handleCpfBlur(event, form.setFieldValue, form.setSubmitting)}>
                                            {(inputProps) => (
                                                <TextField
                                                    {...inputProps}
                                                    type="text"
                                                    label="CPF"
                                                    name="cpf"
                                                    error={form.touched.cpf && !!form.errors.cpf}
                                                    helperText={form.touched.cpf && form.errors.cpf}
                                                    fullWidth
                                                    margin="dense"
                                                />
                                            )}
                                        </InputMask>
                                    )}
                                </Field>
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
                                <Field name="telefoneCelular">
                                    {({ field }) => (
                                        <InputMask mask="(99) 99999-9999" value={field.value} onChange={field.onChange}>
                                            {(inputProps) => (
                                                <TextField
                                                    {...inputProps}
                                                    type="text"
                                                    label="Telefone Celular"
                                                    name="telefoneCelular"
                                                    error={touched.telefoneCelular && !!errors.telefoneCelular}
                                                    helperText={touched.telefoneCelular && errors.telefoneCelular}
                                                    fullWidth
                                                    margin="dense"
                                                />
                                            )}
                                        </InputMask>
                                    )}
                                </Field>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleClose} disabled={isSubmitting}>Cancelar</Button>
                                <Button type="submit" disabled={isSubmitting}>Salvar</Button>
                            </DialogActions>
                        </Form>
                    )}
                </Formik>
            </Dialog>

            {/* Novo Dialog para cadastro de lead não encontrado */}
            <NewLeadDialog
                open={openNewLeadDialog}
                onClose={() => setOpenNewLeadDialog(false)}
                initialCpf={cpfNotFound} // Passa o CPF não encontrado como prop
                onSubmit={(leadData) => {
                    console.log("Novo lead:", leadData);
                    setOpenNewLeadDialog(false);
                    setCpfNotFound(''); // Limpa o estado após o uso
                }}
            />
        </>
    );
};
const NewLeadDialog = ({ open, onClose, initialCpf }) => {
    const [doenca, setDoenca] = useState('Não')

    const [formValues, setFormValues] = useState({
        cpf: '',
        name: '',
        phone_number: '',
        instagram: '',
        birthday: '',
        doenca: '{}',
        adress: '',
    });

    useEffect(() => {
        setFormValues((currentValues) => ({
            ...currentValues,
            cpf: initialCpf || '',
        }));
    }, [initialCpf, open]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormValues((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        // Adapte para converter dados adicionais conforme necessário
        const leadData = {
            ...formValues,
            doenca: doenca === 'Sim' ? JSON.parse(formValues.doenca) : {},
        };

        try {
            const response = await fetch('http://localhost:8000/api/v1/lead/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(leadData),
            });

            if (!response.ok) {
                throw new Error('Falha ao enviar os dados do lead');
            }

            const responseData = await response.json();
            console.log('Lead salvo com sucesso:', responseData);

            // Limpar formulário e fechar diálogo após sucesso
            setFormValues({
                cpf: '',
                name: '',
                phone_number: '',
                instagram: '',
                birthday: '',
                doenca: '{}',
                adress: '',
            });
            onClose();
        } catch (error) {
            console.error('Erro ao salvar o lead:', error);
            // Aqui você pode adicionar uma notificação ao usuário sobre o erro
        }
    };

    const handleChangeDoenca = (e) => {
        setDoenca(e.target.value)
    }
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Cadastrar cliente</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Nome Completo"
                    type="text"
                    fullWidth
                    variant="outlined"
                    name="name"
                    value={formValues.name}
                    onChange={handleChange}
                />
                <InputMask
                    mask="999.999.999-99"
                    value={formValues.cpf}
                    disabled={false}
                    maskChar=" "
                    onChange={handleChange}
                >
                    {() => (
                        <TextField
                            margin="dense"
                            label="CPF"
                            type="text"
                            fullWidth
                            variant="outlined"
                            name="cpf"
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                    )}
                </InputMask>
                <InputMask
                    mask="(99) 99999-9999"
                    value={formValues.phone_number}
                    onChange={handleChange}
                >
                    {() => (
                        <TextField
                            margin="dense"
                            label="Telefone"
                            type="text"
                            fullWidth
                            variant="outlined"
                            name="phone_number"
                        />
                    )}
                </InputMask>
                <TextField
                    margin="dense"
                    label="Instagram"
                    type="text"
                    fullWidth
                    variant="outlined"
                    name="instagram"
                    value={formValues.instagram}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    label="Data de Nascimento"
                    type="date"
                    fullWidth
                    variant="outlined"
                    name="birthday"
                    value={formValues.birthday}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    margin="dense"
                    label="Endereço"
                    type="text"
                    fullWidth
                    variant="outlined"
                    name="adress"
                    value={formValues.adress}
                    onChange={handleChange}
                />
                <Select
                    fullWidth
                    variant="outlined"
                    labelId='doenca-select'
                    label='Doença'
                    value={doenca}
                    onChange={handleChangeDoenca}
                >
                    <MenuItem value={'Sim'}>Sim</MenuItem>
                    <MenuItem value={'Não'}>Não</MenuItem>
                </Select>
                {doenca === 'Sim' && (
                    <TextareaAutosize
                        minRows={3}
                        maxRows={6}
                        cols={70}
                        placeholder="Descreva a doença"
                        fullWidth
                        variant="outlined"
                        label='Qual?'
                        name="other_doenca"
                        value={formValues.other_doenca}
                        onChange={handleChange}
                    />
                )}

            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button onClick={handleSubmit}>Salvar</Button>
            </DialogActions>
        </Dialog>
    );
};



export default NewAppointment;
