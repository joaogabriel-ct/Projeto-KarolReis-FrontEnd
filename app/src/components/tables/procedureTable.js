export default function ProcedureTable({ data }) {
    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg" style={{ fontSize: '0.75rem' }}>
            <table className="w-full text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-4 py-2">
                            Nome do Procedimento
                        </th>
                        <th scope="col" className="px-4 py-2">
                            Preço
                        </th>
                        <th scope="col" className="px-4 py-2">
                            Observação
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((procedure) => (
                        <tr key={procedure.id} className="even:bg-gray-50 odd:bg-white border-b dark:border-gray-700">
                            <td className="px-4 py-2 max-w-[200px] truncate">
                                {procedure.name}
                            </td>
                            <td className="py-2">
                                R$ {procedure.value ? Number(procedure.value).toFixed(2) : 'N/A'}
                            </td>

                            <td className="px-4 py-2 max-w-[300px] truncate">
                                {procedure.observation || 'N/A'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
