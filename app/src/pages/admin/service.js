import Swal from 'sweetalert2';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProcedureTable from '@/components/tables/procedureTable';
import ProcedureForm from '@/components/newProcedure';
import GraficoProcedimentosMaisVendidos from '@/components/totalProcedure';
import AdminLayout from "@/layouts/adminLayout"; 
import { getAPIClient } from "@/pages/api/axios";

function Services() {
    const [data, setData] = useState([]);

    // Função para buscar os dados da API
    const fetchData = async () => {
        const api = await getAPIClient();
        axios.get('http://localhost:8000/api/v1/procedure/')
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the procedures data:', error);
            });
    };

    useEffect(() => {
        // Chama a função para buscar os dados na primeira renderização
        fetchData();
    }, []);

    return (
        <div className="container mx-auto px-4 pt-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    {/* Passando a função fetchData para o formulário */}
                    <ProcedureForm onSuccess={fetchData} />
                </div>
                <div className="flex flex-col gap-8">
                    <div className="overflow-auto" style={{ maxHeight: '400px' }}>
                        <ProcedureTable data={data} />
                    </div>
                    <div>
                        <GraficoProcedimentosMaisVendidos />
                    </div>
                </div>
            </div>
        </div>
    );
}

Services.getLayout = (page) => {
    return <AdminLayout>{page}</AdminLayout>
}

export default Services;
