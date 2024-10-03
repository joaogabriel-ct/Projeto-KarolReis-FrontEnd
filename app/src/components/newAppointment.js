import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, MenuItem, Select, TextareaAutosize } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import InputMask from 'react-input-mask';
import * as Yup from 'yup';
import Swal from 'sweetalert2';


const fetchProcedures = async () => {
    try {
        const response = await api.get('procedure/');
        if (response.status !== 200) {
            throw new Error(`Falha ao buscar procedimentos: ${response.statusText}`);
        }
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar procedimentos:", error);
        return [];
    }
};

const getSellers = async () =>{
    try{
        const response = await api.get('seller/');
        if (response.status !== 200) {
            throw new Error(`Falha ao buscar procedimentos: ${response.statusText}`);
        }
        return response.data;
    } catch (error){
        alert('Error ao buscar nome das meninas.');
        return [];
    }
}

const fetchClientePorCpf = async (cpf) => {
    try {
        const response = await api.get(`lead/?cpf=${cpf}`);
        if (response.status !== 200) {
            throw new Error(`Falha ao buscar cliente por CPF: ${response.statusText}`);
        }
        return response.data.length > 0 ? response.data[0] : null;
    } catch (error) {
        console.error("Erro ao buscar cliente por CPF:", error);
        return null;
    }
};


// Validação do formulário com Yup
const AppointmentSchema = Yup.object().shape({
    name: Yup.string().required('Nome é obrigatório'),
    cpf: Yup.string().required('CPF é obrigatório').matches(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/, 'CPF não é válido'),
    procedureId: Yup.string().required('Procedimento é obrigatório'),
    selleId: Yup.string().required('A escolha de quem vai atender é obrigatório.'),
    date: Yup.date().required('Data é obrigatória').nullable(),
    time: Yup.string().required('Hora é obrigatória'),
    instagram: Yup.string().optional(),
    telefoneCelular: Yup.string().required('Telefone Celular é obrigatório').matches(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, 'Telefone Celular não é válido'),
});

const NewAppointment = ({ open, setOpen }) => {
    const [procedures, setProcedures] = useState([]);
    const [openNewLeadDialog, setOpenNewLeadDialog] = useState(false);
    const [cpfNotFound, setCpfNotFound] = useState('');
    const [seller, setSeller] = useState([]);

    useEffect(() => {
        const loadProcedures = async () => {
            const data = await fetchProcedures();
            setProcedures(data);
        };
        const loadSeller = async () => {
            const data = await getSellers();
            setSeller(data)
        }
        if (open) {
            loadProcedures();
            loadSeller();
        }
    }, [open]);

    const handleClose = () => setOpen(false);

    const handleCpfBlur = async (event, setFieldValue, setSubmitting) => {
        const cpf = event.target.value.replace(/\D/g, ''); // Remove caracteres não numéricos
        setSubmitting(true); // Inicia o indicador de submissão
        try {
            const cliente = await fetchClientePorCpf(cpf);
            if (cliente) {
                setFieldValue('name', cliente.name);
                setFieldValue('instagram', cliente.instagram);
                setFieldValue('telefoneCelular', cliente.phone_number);
            } else {
                setCpfNotFound(cpf);
                setOpenNewLeadDialog(true);
            }
        } catch (error) {
            console.error('Erro ao processar CPF:', error);
        }
        setSubmitting(false); // Sempre finaliza o indicador de submissão
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
                        sellerId: '',
                        date: '',
                        time: '',
                        instagram: '',
                        telefoneCelular: '',
                    }}
                    validationSchema={AppointmentSchema}
                    onSubmit={async (values, { setSubmitting }) => {
                        setSubmitting(true);
                        const cpfClean = values.cpf.replace(/\D/g, '');
                        const leadData = await fetchClientePorCpf(cpfClean);
                        if (!leadData) {
                            Swal.fire('Erro', 'Cliente não encontrado e/ou não foi possível criar um novo.', 'error');
                            setSubmitting(false);
                            return;
                        }
                        const payload = {
                            lead_id: leadData.id,
                            seller_id: values.sellerId,
                            procedure_id: values.procedureId,
                            date: values.date,
                            time: values.time,
                        };
                    
                        try {
                            const response = await api.post('agenda/', payload);
                            if (response.status !== 201 && response.status !== 200) { 
                                throw new Error(`Falha ao criar agendamento: ${response.data.message || ''}`);
                            }
                            Swal.fire('Sucesso!', 'Agendamento criado com sucesso!', 'success').then(handleClose);
                        } catch (error) {
                            console.error('Erro ao salvar agendamento:', error);
                            Swal.fire('Erro!', 'Não foi possível criar o agendamento.', 'error');
                        } finally {
                            setSubmitting(false);
                        }
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
                                    select
                                    name="sellerId"
                                    label="Quem vai atender ?"
                                    fullWidth
                                    margin="normal"
                                    variant="outlined"
                                    onChange={event => setFieldValue("sellerId", event.target.value)}
                                    error={touched.sellerId && !!errors.sellerId}
                                    helperText={touched.sellerId && errors.sellerId}
                                >
                                    {seller.map(option => (
                                        <MenuItem key={option.id} value={option.id}>
                                            {option.name_complete}
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
            const response = api.post('lead/',leadData)
            if (!response.ok) {
                throw new Error('Falha ao enviar os dados do lead');
            }
            const responseData = await response.json();
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
