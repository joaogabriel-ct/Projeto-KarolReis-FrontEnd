export default function ValueTotal({titulo ,transacoes }) {
    let total;
    if (Array.isArray(transacoes)) {
        total = transacoes.reduce((soma, transacao) => soma + (transacao.PROCEDURE.value || 0), 0);
    } else if (transacoes && transacoes.PROCEDURE && transacoes.PROCEDURE.value) {
        
        total = transacoes.PROCEDURE.value;
    } else {
        total = 0;
    }
  
    return (
      <div className="bg-white shadow rounded-lg p-4 text-center border border-gray-200">
        <h2 className="text-lg font-semibold text-blue-600">{titulo}</h2>
        <div className="border-t border-gray-200 my-2"></div> 
        <p className="text-gray-600">Total:</p>
        <p className="text-2xl font-bold">R${total.toFixed(2)}</p>
      </div>
    );
  }
  