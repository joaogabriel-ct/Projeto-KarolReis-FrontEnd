export default function Table({data}) {
    return(
        <div class="relative overflow-x-auto shadow-md ">
            <table class="w-full text-sm text-left rtl:text-right text-gray-800 dark:text-gray-800">
                <thead class="text-xs  uppercase  bg-custom-pink dark:text-gray-900">
                    <tr>
                        <th scope="col" class="px-6 py-3">
                            Nome cliente
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Procedimento
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Preço
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Ultima visita
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody>

                {Object.keys(data).length > 0 && (
                            <tr key={data.id} className="odd:bg-white odd:dark:bg-gray-50 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-grey-600">
                                    {data.LEAD.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap dark:text-grey-600">
                                    {data.PROCEDURE.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap dark:text-grey-600">
                                    R$ {data.PROCEDURE.value.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap dark:text-grey-600">
                                    {data.date}
                                </td>
                                <td className="px-6 py-4 dark:text-grey-600">
                                    <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Editar</a>
                                </td>
                            </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}


