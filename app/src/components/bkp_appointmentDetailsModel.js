import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Formik, Form, Field, useFormik } from 'formik';
import * as Yup from 'yup';
import Inputmask from 'inputmask';

export const AppointmentDetailsModal = ({ appointment, onClose }) => {
    const [acao, setAcao] = useState('');

    const handleClose = () => {
        onClose();
    };

    const validationSchema = Yup.object().shape({
        novaData: Yup.string().required('Nova data é obrigatória'),
        novoHorario: Yup.string().required('Novo horário é obrigatório'),
        formaPagamento: Yup.string().required('Forma de pagamento é obrigatória'),
    });
    
    const formik = useFormik({
        initialValues: {
            novaData: '',
            novoHorario: '',
            formaPagamento: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            if (acao === 'venda') {
                const handleConclusaoVenda = async () => {
                    const payload = {
                        seller_id: appointment.SELLER.id,
                        lead_id: appointment.LEAD.id,
                        procedure_id: appointment.PROCEDURE.id,
                        date: appointment.date,
                        time: appointment.time,
                        type_payment: formaPagamento,
                    };

                    try {
                        await axios.post('http://localhost:8000/api/v1/sales/', payload, {
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        });
                        alert('Venda concluída com sucesso!');
                        onClose();
                    } catch (error) {
                        console.error('Erro ao concluir a venda:', error.response ? error.response.data : error.message);
                        alert('Falha ao concluir a venda. Verifique o console para mais detalhes.');
                    }
                };
                const handleClose = () => {
                    onClose();
                };
            } else if (acao === 'remarcar') {


                const handleRemarcar = async () => {
                    if (!novaData || !novoHorario) {
                        alert('Por favor, selecione uma nova data e horário.');
                        return;
                    }

                    try {
                        await axios.post(`http://localhost:8000/api/v1/agendamento/remarcar/${appointment.id}/`, {
                            date: novaData,
                            time: novoHorario,
                        }, {
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        });
                        alert('Agendamento remarcado com sucesso!');
                        onClose();
                    } catch (error) {
                        console.error('Erro ao remarcar o agendamento:', error.response ? error.response.data : error.message);
                        alert('Falha ao remarcar o agendamento. Verifique o console para mais detalhes.');
                    }
                };
            }
        },
    });

    useEffect(() => {
        if (appointment) {
            formik.setValues({
                cpf: appointment.LEAD.cpf,
                novaData: format(parseISO(appointment.date), 'yyyy-MM-dd'),
                novoHorario: appointment.time,
                formaPagamento: '',
            });
        }
    }, [appointment]);

    return (
        <Dialog open={true} onClose={handleClose}>
            <DialogTitle>Detalhes do Agendamento</DialogTitle>
            <DialogContent>

                {appointment && (
                    <Form>
                        <Field>
                            {({field, form}) => (
                                <Inputmask mask='999.999.999-99'
                                    value={formik.values.cpf}
                                >

                                </Inputmask>

                            )}
                        </Field>
                    </Form>
                )}
                <TextField
                    fullWidth
                    id="novaData"
                    name="novaData"
                    label="Nova Data"
                    type="date"
                    value={formik.values.novaData}
                    onChange={formik.handleChange}
                    error={formik.touched.novaData && Boolean(formik.errors.novaData)}
                    helperText={formik.touched.novaData && formik.errors.novaData}
                />
                <TextField
                    fullWidth
                    id="novoHorario"
                    name="novoHorario"
                    label="Novo Horário"
                    type="time"
                    value={formik.values.novoHorario}
                    onChange={formik.handleChange}
                    error={formik.touched.novoHorario && Boolean(formik.errors.novoHorario)}
                    helperText={formik.touched.novoHorario && formik.errors.novoHorario}
                />
                <FormControl fullWidth>
                    <InputLabel id="formaPagamento-label">Forma de Pagamento</InputLabel>
                    <Select
                        labelId="formaPagamento-label"
                        id="formaPagamento"
                        name="formaPagamento"
                        value={formik.values.formaPagamento}
                        onChange={formik.handleChange}
                        error={formik.touched.formaPagamento && Boolean(formik.errors.formaPagamento)}
                    >
                        <MenuItem value="">Selecione a forma de pagamento</MenuItem>
                        <MenuItem value="1">Cartão de Crédito</MenuItem>
                        <MenuItem value="2">Boleto</MenuItem>
                        <MenuItem value="3">Pix</MenuItem>
                        <MenuItem value="4">Dinheiro</MenuItem>
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="secondary">
                    Cancelar
                </Button>
                <Button onClick={formik.handleSubmit} color="primary">
                    {acao === 'venda' ? 'Concluir Venda' : 'Confirmar Remarcação'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
