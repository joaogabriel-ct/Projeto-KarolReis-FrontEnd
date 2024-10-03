import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getAPIClient } from "@/pages/api/axios";
import Swal from 'sweetalert2';

const SaleDetail = () => {
    const router = useRouter();
    const { id } = router.query; // Obter o ID da URL
    const [sale, setSale] = useState(null);
    const [loading, setLoading] = useState(true);
    const [typePayment, setTypePayment] = useState(''); // Estado para armazenar o tipo de pagamento
    const [mapa, setMapa] = useState(''); // Estado para armazenar o campo "mapa"
    const [cola, setCola] = useState(''); // Estado para armazenar o campo "cola"
    const [tintura, setTintura] = useState(''); // Estado para armazenar o campo "tintura"
    const [dateReturn, setDateReturn] = useState(''); // Estado para armazenar o campo opcional "date_return"
    const [procedureId, setProcedureId] = useState(null); // Armazenar o procedure_id correto

    useEffect(() => {
        const fetchData = async () => {
            const api = await getAPIClient();
            if (id) {
                // Fazer a requisição para buscar os detalhes da venda com base no ID
                api.get(`/agendamento/${id}/`)
                    .then((response) => {
                        setSale(response.data);
                        setLoading(false);
                    })
                    .catch((error) => {
                        console.error("Erro ao buscar os detalhes da venda:", error);
                        setLoading(false);
                    });
            }
        };
        fetchData();
    }, [id]);

    // Simulando uma função que mapeia nome do procedimento para ID
    const getProcedureIdByName = async (procedureName) => {
        try {
            const api = await getAPIClient();
            const response = await api.get(`/procedure/`); // Faça uma requisição ao backend para pegar os IDs
            const procedure = response.data.find(p => p.name === procedureName);
            return procedure ? procedure.id : null;
        } catch (error) {
            console.error("Erro ao buscar o ID do procedimento:", error);
            return null;
        }
    };

    const handleFinalizeSale = async () => {
        if (!sale) return;

        // Pegar o ID do procedimento antes de enviar o payload
        const procedureId = await getProcedureIdByName(sale.procedures[0]);

        const payload = {
            seller_id: sale.SELLER.id,
            lead_id: sale.LEAD.id,
            procedure_id: procedureId, // Enviar o ID correto do procedimento
            type_payment: parseInt(typePayment),
            mapa,
            cola,
            tintura,
            date_return: dateReturn || null,
        };

        try {
            const api = await getAPIClient();
            await api.post(`/sales/`, payload);
            Swal.fire("Sucesso!", "Venda finalizada com sucesso!", "success");
            router.push("/admin/sales");
        } catch (error) {
            console.error("Erro ao finalizar a venda:", error);
            Swal.fire("Erro", "Falha ao finalizar a venda. Verifique se todos os campos obrigatórios foram preenchidos.", "error");
        }
    };

    if (loading) {
        return <p>Carregando...</p>;
    }

    if (!sale) {
        return <p>Venda não encontrada.</p>;
    }

    return (
        <div className="container mx-auto px-4 pt-20">
            <h1 className="text-2xl font-bold mb-4">Detalhes do Agendamento</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <h2 className="text-lg font-semibold">Vendedora</h2>
                    <p><strong>Nome:</strong> {sale.SELLER.name_complete}</p>
                    <p><strong>CPF:</strong> {sale.SELLER.cpf}</p>
                    <p><strong>Telefone:</strong> {sale.SELLER.phone_number}</p>
                </div>
                <div>
                    <h2 className="text-lg font-semibold">Cliente</h2>
                    <p><strong>Nome:</strong> {sale.LEAD.name}</p>
                    <p><strong>CPF:</strong> {sale.LEAD.cpf}</p>
                    <p><strong>Telefone:</strong> {sale.LEAD.phone_number}</p>
                    <p><strong>Endereço:</strong> {sale.LEAD.adress}</p>
                </div>
                <div>
                    <h2 className="text-lg font-semibold">Procedimentos</h2>
                    <p>{sale.procedures[0]}</p>
                </div>
                <div>
                    <h2 className="text-lg font-semibold">Horários</h2>
                    <p><strong>Início:</strong> {new Date(sale.data_init).toLocaleString()}</p>
                    <p><strong>Fim:</strong> {new Date(sale.data_end).toLocaleString()}</p>
                </div>
            </div>

            {/* Campo de tipo de pagamento */}
            <div className="mt-4">
                <label htmlFor="type_payment" className="block text-sm font-medium text-gray-700">
                    Tipo de Pagamento
                </label>
                <select
                    id="type_payment"
                    value={typePayment}
                    onChange={(e) => setTypePayment(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                    <option value="">Selecione o tipo de pagamento</option>
                    <option value="1">Cartão de crédito</option>
                    <option value="2">Boleto</option>
                    <option value="3">Pix</option>
                    <option value="4">Dinheiro</option>
                </select>
            </div>

            {/* Campos adicionais */}
            <div className="mt-4">
                <label htmlFor="mapa" className="block text-sm font-medium text-gray-700">Mapa</label>
                <input
                    type="text"
                    id="mapa"
                    value={mapa}
                    onChange={(e) => setMapa(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                />
            </div>
            <div className="mt-4">
                <label htmlFor="cola" className="block text-sm font-medium text-gray-700">Cola</label>
                <input
                    type="text"
                    id="cola"
                    value={cola}
                    onChange={(e) => setCola(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                />
            </div>
            <div className="mt-4">
                <label htmlFor="tintura" className="block text-sm font-medium text-gray-700">Tintura</label>
                <input
                    type="text"
                    id="tintura"
                    value={tintura}
                    onChange={(e) => setTintura(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                />
            </div>

            {/* Campo de data_return opcional */}
            <div className="mt-4">
                <label htmlFor="date_return" className="block text-sm font-medium text-gray-700">Data de Retorno (Opcional)</label>
                <input
                    type="date"
                    id="date_return"
                    value={dateReturn}
                    onChange={(e) => setDateReturn(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                />
            </div>

            <div className="mt-6">
                <button 
                    onClick={handleFinalizeSale} 
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                >
                    Finalizar Venda
                </button>
            </div>
        </div>
    );
};

export default SaleDetail;
