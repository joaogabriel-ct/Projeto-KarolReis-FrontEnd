import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Swal from 'sweetalert2';


function VisitsPage() {
    const router = useRouter();
    const [clientInfo, setClientInfo] = useState(null);
    const [remarcacoes, setRemarcoes] = useState('')
    const [visitsData, setVisitsData] = useState([]);
    const [error, setError] = useState(null);
    const { id } = router.query;
    useEffect(() => {

        if (id) {

            axios.get(`http://localhost:8000/api/v1/visitas-total/${id}/`)
                .then((response) => {
                    if (response.data.detalhes_visitas.length > 0) {
                        // Assume que todos os registros possuem os mesmos dados do cliente
                        const clientData = response.data.detalhes_visitas[0].LEAD;
                        const remarcacoes = response.data.total_remarcacoes
                        setRemarcoes(remarcacoes)
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
    }, [id]);


    if (error) return <p>Erro ao carregar os dados das visitas.</p>;

    return (
        <div className="container mx-auto p-6">

            <h1 className="justify-center items-center text-2xl font-semibold mb-4">Perfil do {clientInfo.name}</h1>
            {clientInfo ? (
                <div className='p-8 justify-center items-center'>
                    <div className="flex bg-white justify-center items-center rounded-lg mb-6">
                        <p className='p-4'><strong>Remarcações:</strong> {remarcacoes}</p>
                        <p className='p-4'><strong>Telefone:</strong> {clientInfo.phone_number}</p>
                        <p className='p-4'><strong>Instagram:</strong> @{clientInfo.instagram}</p>
                        <p className='p-4'><strong>Aniversário:</strong> {new Date(clientInfo.birthday).toLocaleDateString()}</p>

                    </div>
                </div>
            ) : <p>Carregando informações do cliente...</p>}

            <h2 className="text-2xl font-semibold mb-4">Detalhes das Visitas</h2>
            {visitsData.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {visitsData.map((visita, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg shadow-lg">
                            <p><strong>Data da Visita:</strong> {new Date(visita.date).toLocaleDateString()}</p>
                            <p><strong>Procedimento:</strong> {visita.PROCEDURE.name} - R$ {visita.PROCEDURE.value.toFixed(2)}</p>
                            <p><strong>Vendedor:</strong> {visita.SELLER.name_complete}</p>
                            <p><strong>Forma de Pagamento:</strong> {['Cartão de crédito', 'Boleto', 'Pix', 'Dinheiro'][visita.type_payment - 1]}</p>
                            {visita.PROCEDURE.observation && <p><strong>Observação:</strong> {visita.PROCEDURE.observation}</p>}
                        </div>
                    ))}
                </div>
            ) : (
                <p>Nenhuma visita registrada para este cliente.</p>
            )}
        </div>
    );
}

export default VisitsPage;
