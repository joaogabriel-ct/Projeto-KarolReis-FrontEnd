export default function ClientTable({ data, onRowClick }) {
    return (
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg" style={{ fontSize: '0.75rem' }}>
        <table className="w-full text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-4 py-2">Nome do Cliente</th>
              <th scope="col" className="px-4 py-2">Email</th>
              <th scope="col" className="px-4 py-2">Telefone</th>
            </tr>
          </thead>
          <tbody>
            {data.map((client) => (
              <tr
                key={client.id}
                className="even:bg-gray-50 odd:bg-white border-b dark:border-gray-700 cursor-pointer"
                onClick={() => onRowClick(client)}
              >
                <td className="px-4 py-2 max-w-[200px] truncate">{client.name}</td>
                <td className="px-4 py-2 max-w-[200px] truncate">
                  {client.user?.email || 'N/A'}
                </td>
                <td className="px-4 py-2 max-w-[200px] truncate">
                  {client.phone_number || 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  