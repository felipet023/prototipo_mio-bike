import { useLocation, useParams, Link } from 'react-router-dom';

export default function ConfirmationPage() {
  const { id } = useParams();
  const location = useLocation();
  const pedido = location.state;
  return (
    <main className="page">
      <h1>¡Pago exitoso!</h1>
      <p>Tu pedido #{id} ha sido confirmado.</p>
      {pedido && (
        <div className="card">
          <p>Número: {pedido.numero_pedido}</p>
          <p>Total: ${Number(pedido.total).toLocaleString('es-CO')}</p>
          <p>Estado: {pedido.estado}</p>
          {pedido.pago && <p>Código de transacción: {pedido.pago.codigo_transaccion}</p>}
        </div>
      )}
      <Link to="/cuenta" className="btn-primary">Ver mis pedidos</Link>
    </main>
  );
}