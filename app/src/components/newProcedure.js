import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { getAPIClient } from "@/pages/api/axios";

const schema = Yup.object().shape({
    name: Yup.string().required('O nome do procedimento é obrigatório'),
    value: Yup.number().typeError('O valor deve ser um número').positive('O valor deve ser positivo').required('O valor é obrigatório'),
    duration_hours: Yup.number().required('A duração é obrigatória').positive('A duração deve ser positiva'),
    observation: Yup.string(),
});

export default function ProcedureForm() {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });

    const onSubmit = data => {
        const fetchData = async () => {
            const api = await getAPIClient();
            api.post('operation/procedure/', data)
                .then(response => {
                    alert('Procedimento cadastrado com sucesso!');
                })
                .catch(error => {
                    console.error('Erro ao cadastrar o procedimento:', error);
                });
        };
        fetchData();
    };

    return (
        <div className="mx-auto max-w-2xl bg-white p-8 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-6 text-center">Cadastro de Procedimentos</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">Nome do Procedimento</label>
                    <input type="text" {...register('name')} className="bg-white border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                    <p className="text-red-500">{errors.name?.message}</p>
                </div>
                <div>
                    <label htmlFor="value" className="block mb-2 text-sm font-medium text-gray-900">Valor do Procedimento</label>
                    <input type="number" step="0.01" {...register('value')} className="bg-white border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                    {errors.value && <p className="text-red-500">{errors.value.message}</p>}
                </div>
                <div>
                    <label htmlFor="duration_hours" className="block mb-2 text-sm font-medium text-gray-900">Duração do Procedimento (em horas)</label>
                    <input type="number" step="0.01" {...register('duration_hours')} className="bg-white border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                    <p className="text-red-500">{errors.duration_hours?.message}</p>
                </div>
                <div>
                    <label htmlFor="observation" className="block mb-2 text-sm font-medium text-gray-900">Observações</label>
                    <textarea {...register('observation')} className="bg-white border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" rows="4"></textarea>
                </div>
                <button type="submit" className="bg-blue-700 text-white rounded-lg px-5 py-2.5">Cadastrar Procedimento</button>
            </form>
        </div>
    );
}
