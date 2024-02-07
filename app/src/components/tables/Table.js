export default function Table({ data }) {
    function formatDate(isoString) {
        const date = new Date(isoString);
        return date.toLocaleDateString("pt-BR", {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',

        });
    }


    return (
        <div className="relative overflow-x-auto shadow-md ">
            <table className="w-full text-sm text-left rtl:text-right text-gray-800 dark:text-gray-800">
                <thead className="text-xs uppercase bg-custom-pink dark:text-gray-900">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Nome cliente
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Procedimento
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Preço
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Ultima visita
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {data && data.length > 0 && data.map((item) => (
                        <tr key={item.id} className="border-b dark:border-gray-700 odd:bg-white odd:dark:bg-gray-50 even:bg-gray-50 even:dark:bg-gray-300">
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-grey-600">
                                <a href={`venda/${item.LEAD.id}`}>
                                    {item.LEAD ? item.LEAD.name : 'Sem nome'}
                                </a>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap dark:text-grey-600">
                                <a href={`venda/${item.LEAD.id}`}>
                                    {item.PROCEDURE.name}
                                </a>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap dark:text-grey-600">
                                <a href={`venda/${item.LEAD.id}`}>
                                    R$ {item.PROCEDURE.value.toFixed(2)}
                                </a>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap dark:text-grey-600">
                                <a href={`venda/${item.LEAD.id}`}>
                                    {formatDate(item.date)}
                                </a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}


