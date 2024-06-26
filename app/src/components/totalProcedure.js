import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DadosGraficoProcedimentos from './charts/chartsProcedure';
import { api } from '@/service/api';


const GraficoProcedimentosMaisVendidos = () => {
    const [dados, setDados] = useState([]);

    useEffect(() => {
        api.get('dados-procedimentos/')
            .then(response => {
                setDados(response.data.map(item => ({ nome: item.procedure_id__name, vendas: item.total_vendas })));
            })
            .catch(error => {
                console.error('Houve um erro ao buscar os dados dos procedimentos mais vendidos:', error);
            });
    }, []);

    return (
        <div className="flex justify-center items-center min-h-[400px]">
        <DadosGraficoProcedimentos dados={dados} />
    </div>
    );
};

export default GraficoProcedimentosMaisVendidos;
