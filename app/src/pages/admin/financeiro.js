// pages/financeiro.js
import Table from "@/components/tables/Table";
import { useEffect, useState } from "react";
import dynamic from 'next/dynamic';
import ValueTotal from "@/components/valueTotal";
import { getAPIClient } from "@/pages/api/axios"; 
import AdminLayout from "@/layouts/adminLayout"; 
import { Container } from "@/components/container";

const DynamicCharts = dynamic(() => import("@/components/charts/charts"))

function Financeiro() {
    const [data, setData] = useState([]);
    useEffect(() => {
        // Chame getAPIClient sem parâmetros se não precisar de contexto
        const fetchData = async () => {
            const api = await getAPIClient(); // Aguarde o retorno da instância API

            api.get('sales/sales/')
                .then(response => {
                    setData(response.data);
                })
                .catch(error => {
                    console.error('There was an error fetching the sales data:', error);
                });
        };

        fetchData();
    }, []);

    return (
        <Container>
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
        </Container>
    );
}

Financeiro.getLayout = (page) => {
    return <AdminLayout>{page}</AdminLayout>;
};

export default Financeiro;
export async function getServerSideProps() {
    return {
      props: {
        isAdminRoute: true,
      },
    };
  }
