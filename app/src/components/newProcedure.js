import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import InputMask from 'react-input-mask';
import axios from 'axios';
import * as Yup from 'yup';
import { CampoMoeda } from './campoMoeda';

const schema = Yup.object().shape({
    name: Yup.string().required('O nome do procedimento é obrigatório'),
    value: Yup.number().typeError('O valor deve ser um número').positive('O valor deve ser positivo').required('O valor é obrigatório'),
    observation: Yup.string(),
});

export default function ProcedureForm() {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });
    React.useEffect(() => {
        register('valor');
    }, [register, setValue]);
    const onSubmit = data => {
        console.log(data);
        // Substitua a URL pela sua API endpoint para cadastro de procedimentos
        axios.post('http://localhost:8000/api/v1/procedure/', data)
            .then(response => {
                // Trate a resposta como achar necessário
                alert('Procedimento cadastrado com sucesso!');
            })
            .catch(error => {
                console.error('Ocorreu um erro ao cadastrar o procedimento:', error);
            });
    };

    return (
        
            <div className="mx-auto max-w-2xl bg-white p-8 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-6">Cadastro de Procedimentos</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label htmlFor="nome" className="block mb-2 text-sm font-medium text-slate-900 dark:text-slate-300">Nome do Procedimento</label>
                        <input type="text" {...register('name')} className="bg-gray-50 border border-gray-300 text-slate-950 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
                        <p className="text-red-500">{errors.name?.message}</p>
                    </div>
                    <div>
                        <label htmlFor="value" className="block mb-2 text-sm font-medium text-slate-950 dark:text-slate-300">Valor do Procedimento</label>
                        <CampoMoeda
                            name="value"
                            placeholder="R$ 1250,00"
                            onChange={(e) => setValue('value', e.target.value.replace(/[^\d,]/g, '').replace(',', '.'), { shouldValidate: true })}
                        />
                        {errors.value && <p className="text-red-500">{errors.value.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="observation" className="block mb-2 text-sm font-medium text-slate-950 dark:text-slate-300">Observações</label>
                        <textarea style={{ resize: 'none' }} {...register('observation')} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" rows="4"></textarea>
                    </div>
                    <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Cadastrar Procedimento</button>
                </form>
            </div>
        
    );
}
