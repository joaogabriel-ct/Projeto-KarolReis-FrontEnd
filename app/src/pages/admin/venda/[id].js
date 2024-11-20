import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';
import { getAPIClient } from "@/pages/api/axios";
import AdminLayout from "@/layouts/adminLayout";

function VisitsPage() {
    const router = useRouter();
    const [clientInfo, setClientInfo] = useState(null);
    const [remarcacoes, setRemarcoes] = useState(0); // Alterado para número, já que remarcações parece ser um número no backend
    const [visitsData, setVisitsData] = useState([]);
    const [error, setError] = useState(null);
    const { id } = router.query;

    useEffect(() => {
        const fetchData = async () => {
            const api = await getAPIClient();
            if (id) {
                api.get(`visitas-total/${id}/`)
                    .then((response) => {
                        if (response.data.detalhes_visitas.length > 0) {
                            // Assume que todos os registros possuem os mesmos dados do cliente
                            const clientData = response.data.detalhes_visitas[0].lead;
                            const remarcacoes = response.data.total_remarcacoes;
                            setRemarcoes(remarcacoes);
                            setClientInfo(clientData);
                        }
                        setVisitsData(response.data.detalhes_visitas);
                    })
                    .catch((error) => {
                        setError(error);

                        Swal.fire({
                            icon: 'error',
                            title: 'Erro!',
                            text: 'Houve um problema ao carregar os dados das visitas.',
                        });
                    });
            }
        }
        fetchData();
    }, [id]);

    if (error) return <p>Erro ao carregar os dados das visitas.</p>;

    return (
        <div className="container mx-auto p-6">
            {clientInfo ? (
                <div className='p-8 bg-white rounded-lg shadow-lg justify-center items-center'>
                    {/* Nome do cliente */}
                    <h1 className="text-center text-2xl font-semibold mb-4">{clientInfo?.name}</h1>

                    {/* Informações principais do cliente */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <p className='p-4'><strong>Remarcações:</strong> {remarcacoes}</p> {/* Alterado para mostrar número */}
                        <p className='p-4'><strong>Telefone:</strong> {clientInfo?.phone_number}</p>
                        <p className='p-4'><strong>Instagram:</strong> @{clientInfo?.instagram}</p>
                        <p className='p-4'><strong>Aniversário:</strong> {new Date(clientInfo?.birthday).toLocaleDateString()}</p>
                    </div>

                    {/* Detalhes das visitas */}
                    {visitsData && visitsData.length > 0 ? (
                        <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
                            <h2 className="text-xl font-medium mb-4">Detalhes das Visitas</h2>
                            {visitsData.map((visita, index) => (
                                <div key={visita.id} className="mb-4 border-b pb-4">
                                    <h3 className="text-lg font-semibold mb-2">Visita {index + 1}</h3>
                                    <p><strong>Vendedora:</strong> {visita.seller.name_complete}</p>
                                    <p><strong>Procedimento:</strong> {visita.procedure.name}</p>
                                    <p><strong>Valor:</strong> R${visita.procedure.value}</p>
                                    <p><strong>Data da Visita:</strong> {new Date(visita.date).toLocaleDateString()}</p>
                                    <p><strong>Data de Retorno:</strong> {new Date(visita.date_return).toLocaleDateString()}</p>
                                    <p><strong>Pagamento:</strong> {['Cartão de crédito', 'Boleto', 'Pix', 'Dinheiro'][visita.type_payment - 1]}</p>
                                    <p><strong>Mapa:</strong> {visita.mapa}</p>
                                    <p><strong>Cola:</strong> {visita.cola}</p>
                                    <p><strong>Tintura:</strong> {visita.tintura}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>Nenhuma visita registrada.</p>
                    )}
                </div>
            ) : (
                <p>Carregando informações do cliente...</p>
            )}

            <h2 className="text-2xl font-semibold m-4">Detalhes das Visitas</h2>
            {visitsData.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {visitsData.map((visita, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg shadow-lg">
                            <p><strong>Data da Visita:</strong> {new Date(visita.date).toLocaleDateString()}</p>
                            <p>
                                <strong>Procedimento:</strong> {visita.procedure.name} -
                                R$ {visita.procedure?.value ? parseFloat(visita.procedure.value).toFixed(2) : '0.00'}
                            </p>
                            <p><strong>Profissional:</strong> {visita.seller.name_complete}</p>
                            <p><strong>Forma de Pagamento:</strong> {['Cartão de crédito', 'Boleto', 'Pix', 'Dinheiro'][visita.type_payment - 1]}</p>
                            {visita.procedure.observation && <p><strong>Observação:</strong> {visita.procedure.observation}</p>}
                        </div>
                    ))}
                </div>
            ) : (
                <p>Nenhuma visita registrada para este cliente.</p>
            )}
        </div>
    );
}

VisitsPage.getLayout = (page) => {
    return <AdminLayout>{page}</AdminLayout>
}

export default VisitsPage;
