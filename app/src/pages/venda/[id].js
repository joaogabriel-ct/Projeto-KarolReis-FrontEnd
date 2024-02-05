import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Swal from 'sweetalert2';


function VisitsPage() {
    const router = useRouter();
    const [clientInfo, setClientInfo] = useState(null);
    const [visitsData, setVisitsData] = useState([]);
    const [error, setError] = useState(null);
    const { id } = router.query;
    useEffect(() => {
        
        if (id) {
            
            axios.get(`http://localhost:8000/api/v1/visitas-total/${id}/`)
                .then((response) => {
                    if(response.data.detalhes_visitas.length > 0){
                        // Assume que todos os registros possuem os mesmos dados do cliente
                        const clientData = response.data.detalhes_visitas[0].LEAD;
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
            <h1 className="text-2xl font-semibold mb-4">Perfil do Cliente</h1>
            {clientInfo ? (
                <div className="bg-white p-4 rounded-lg shadow-lg mb-6">
                    <h3 className="text-lg font-semibold mb-2">{clientInfo.name}</h3>
                    <p><strong>Telefone:</strong> {clientInfo.phone_number}</p>
                    <p><strong>Instagram:</strong> @{clientInfo.instagram}</p>
                    <p><strong>Aniversário:</strong> {new Date(clientInfo.birthday).toLocaleDateString()}</p>
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
