
import Table from "@/components/tables/Table";
import axios from "axios";
import { useEffect, useState } from "react";
import dynamic from 'next/dynamic';
import ValueTotal from "@/components/valueTotal";

const DynamicCharts = dynamic(() => import("@/components/charts/charts"))

export default function Financeiro() {
    const [data, setData] = useState([])

    useEffect(() => {
        axios.get('http://localhost:8000/api/v1/sales/1/')
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the Closers data:', error);
            })

    }, [])


    return (
        <div className="container mx-auto p-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Cards na primeira linha */}
                <div className="lg:col-span-3">
                    {/* Card para Resumo Financeiro */}
                    <div className="p-4 bg-white shadow rounded-lg h-full">
                        <ValueTotal titulo={'Financeiro'} transacoes={data} />

                    </div>
                </div>
                <div className="lg:col-span-9">
                    {/* Card para o Gráfico */}
                    <div className="p-4 bg-white shadow rounded-lg h-full">
                        <DynamicCharts salesData={data} />
                    </div>
                </div>

                {/* Card para Vendas mais recentes - ocupando toda a largura na nova linha */}
                <div className="lg:col-span-12">
                    <div className="mt-4 p-4 bg-white shadow rounded-lg">
                        <Table data={data} />
                    </div>
                </div>
            </div>
        </div>
    );
}
