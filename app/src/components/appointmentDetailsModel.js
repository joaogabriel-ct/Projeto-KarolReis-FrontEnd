import React, { useState, useEffect } from "react";
import axios from "axios";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { DateField } from '@mui/x-date-pickers/DateField';
import * as yup from 'yup';
import InputMask from 'react-input-mask';
import { format, parseISO } from 'date-fns';
import { Form, Formik, Field } from "formik";

const scheduleDetailsModel = yup.object().shape({
    procedimento: yup.string().required('O campo procedimento, é obrigatório'),
    name: yup.string().required('O campo nome, é obrigatório'),
    data: yup.date().required('O campo data, é obrigatória'),
    horario: yup.string().required('O campo Hora, é obrigatória'),
    seller: yup.string().required('O campo vendedora, é obrigatória'),
    value: yup.string().required('O campo valor, é obrigatorio'),
    acao: yup.string().required('Ação é obrigatória'),
    formaPagamento: yup.string().when('acao', {
        is: 'venda',
        then: yup.string().required('Forma de pagamento é obrigatória'),
        otherwise: yup.string().notRequired(),
    }),
    novaData: yup.date().when('acao', {
        is: 'remarcar',
        then: yup.date().required('Nova data é obrigatória'),
        otherwise: yup.date().notRequired(),
    }),
    novoHorario: yup.string().when('acao', {
        is: 'remarcar',
        then: yup.string().required('Novo horário é obrigatório'),
        otherwise: yup.string().notRequired(),
    }),
});

export const AppointmentDetailsModal = ({ appointment, onClose }) => {
    const [acao, setAcao] = useState('');
    const [novaData, setNovaData] = useState('');
    const [novoHorario, setNovoHorario] = useState('');

    const handleClose = () => {
        onClose();
    };
    console.log(appointment);

    return (
        <>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle> Detalhes do Agendamento </DialogTitle>
                <Formik
                    initialValues={{
                        procedimento: "",
                        name: "",
                        data: "",
                        horario: "",
                        seller: "",
                        value: "",
                        acao: "",
                        formaPagamento: "",
                        novaData: "",
                        novoHorario: "",
                    }}
                    validationSchema={scheduleDetailsModel}

                >
                    {({ errors, touched, isSubmitting, setFieldValue }) => (
                        <Form>
                            <DialogContent>

                                <TextField
                                    margin="dense"
                                    label="Nome Vendedora"
                                    type="text"
                                    fullWidth
                                    value={appointment.SELLER.
                                        name_complete}

                                ></TextField>
                                <TextField
                                    margin="dense"
                                    label="Cliente"
                                    type="text"
                                    fullWidth
                                    value={appointment.LEAD.
                                        name}
                                ></TextField>
                                <InputMask
                                    mask="(99) 99999-9999"
                                    value={appointment.LEAD.phone_number}

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
                                    label="Procedimento"
                                    type="text"
                                    fullWidth
                                    value={appointment.PROCEDURE.name}
                                ></TextField>
                                <TextField
                                    margin="dense"
                                    label="Procedimento Valor"
                                    type="text"
                                    fullWidth
                                    value={appointment.PROCEDURE.value}
                                ></TextField>
                                <Select
                                    value={acao}
                                    onChange={(e) => setAcao(e.target.value)}
                                    className="px-4 py-2 border rounded"

                                >
                                    <MenuItem value={'venda'}>Concluir Venda</MenuItem>
                                    <MenuItem value={'remarcar'}>Remarcar</MenuItem>
                                </Select>
                                {acao === 'remarcar' && (
                                    <>
                                    <TextField
                                        margin="dense"
                                        label="Date do Reagendamento"
                                        type="date"
                                        fullWidth
                                        value={novaData}
                                        onChange={(e) => setNovaData(e.target.value)}
                                    >
                                    </TextField>
                                    <DateField label="Basic date field"/>
                                    </>
                                )}

                            </DialogContent>
                        </Form>
                    )}
                </Formik>
                <DialogActions>
                    <Button onClick={onClose}>Cancelar</Button>
                    <Button >Salvar</Button>
                </DialogActions>

            </Dialog>
        </>
    );

};