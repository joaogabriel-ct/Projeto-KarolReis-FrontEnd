import React, { useState, useEffect } from 'react';
import { Button, CircularProgress } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as yup from 'yup';
import { getAPIClient } from "@/pages/api/axios";
import moment from 'moment-timezone';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Validação com Yup
const scheduleDetailsModel = yup.object().shape({
  seller_id: yup.number().required('Selecione um vendedor'),
  lead_id: yup.string().required('Selecione um cliente'),
  data_init: yup.date().required('Selecione uma data').nullable(),
});

export default function AgendamentoForm({ initialValues, onSubmit }) {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Busca dados iniciais
  useEffect(() => {
    const fetchDados = async () => {
      setLoading(true);
      const api = await getAPIClient();
      try {
        const responseSellers = await api.get('seller/');
        setSellers(responseSellers.data);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDados();
  }, []);

  // Formatação da data para ISO String
  const formatToISOString = (date) => {
    return moment.tz(date, 'America/Sao_Paulo').format("YYYY-MM-DDTHH:mm:ssZ");
  };

  // Submissão do formulário
  const handleSubmit = async (values) => {
    try {
      const api = await getAPIClient();
      const response = await api.post('agenda/', values);
      console.log('Agendamento realizado com sucesso:', response.data);
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
    }
  };

  // Carregamento
  if (loading) {
    return <div className="flex justify-center items-center"><CircularProgress /></div>;
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={scheduleDetailsModel}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ errors, touched, setFieldValue, values }) => (
        <Form className="w-full max-w-lg mx-auto">
          {/* Selecione um vendedor */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="seller_id">
              Selecione um Vendedor
            </label>
            <Field
              name="seller_id"
              as="select"
              className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight text-gray-900"
              onChange={(e) => setFieldValue('seller_id', parseInt(e.target.value, 10))}
            >
              <option value="">Selecione</option>
              {sellers.map((seller) => (
                <option key={seller.id} value={seller.id}>{seller.name_complete}</option>
              ))}
            </Field>
            {errors.seller_id && touched.seller_id && (
              <div className="text-red-500 text-sm">{errors.seller_id}</div>
            )}
          </div>

          {/* Selecione uma data */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="data_init">
              Selecione uma Data
            </label>
            <DatePicker
              selected={values.data_init ? new Date(values.data_init) : null}
              onChange={(date) => setFieldValue('data_init', formatToISOString(date))}
              className="block w-full bg-white border border-gray-300 rounded py-2 px-3 shadow leading-tight text-gray-900"
              dateFormat="dd/MM/yyyy"
              placeholderText="Selecione uma data"
              minDate={new Date()}
              maxDate={new Date(new Date().setMonth(new Date().getMonth() + 2))}
            />
            {errors.data_init && touched.data_init && (
              <div className="text-red-500 text-sm">{errors.data_init}</div>
            )}
          </div>

          {/* Submissão */}
          <div className="flex justify-center">
            <Button type="submit" variant="contained" color="primary">
              Agendar
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
