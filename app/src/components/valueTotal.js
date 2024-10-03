export default function ValueTotal({ titulo, transacoes }) {
  let total = 0;  // Inicializa total como 0

  // Verifica se transacoes é um array
  if (Array.isArray(transacoes)) {
      total = transacoes.reduce((soma, transacao) => {
          const valor = parseFloat(transacao.procedure?.value) || 0;  // Garante que value seja numérico
          return soma + valor;
      }, 0);
  } else if (transacoes?.procedure?.value) {
      // Se for um único objeto transacao com procedure e value
      total = parseFloat(transacoes.procedure.value) || 0;  // Garante que value seja numérico
  }

  return (
    <div className="bg-white shadow rounded-lg p-4 text-center border border-gray-200">
      <h2 className="text-lg font-semibold text-blue-600">{titulo}</h2>
      <div className="border-t border-gray-200 my-2"></div>
      <p className="text-gray-600">Total:</p>
      <p className="text-2xl font-bold">R${total.toFixed(2)}</p>  {/* Garante que toFixed seja chamado em número */}
    </div>
  );
}
