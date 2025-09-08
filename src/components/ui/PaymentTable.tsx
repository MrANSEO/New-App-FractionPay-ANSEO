import { Payment } from "../../store";  // Assure-toi d'avoir ce type

interface Props {
  payments: Payment[];
}

export default function PaymentTable({ payments }: Props) {
  return (
    <table className="payment-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Client</th>
          <th>Montant</th>
          <th>Date</th>
          <th>Statut</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {payments.map(p => (
          <tr key={p.paymentId}>
            <td>#{p.paymentId.slice(-6)}</td>
            <td>{p.payer.email}</td>
            <td>{p.steps.reduce((a, s) => a + s.amount, 0)} €</td>
            <td>{new Date(p.createdAt).toLocaleDateString()}</td>
            <td>
              <span className={`status-badge ${p.status.toLowerCase()}`}>
                {p.status}
              </span>
            </td>
            <td>
              <button className="btn btn-sm">Détails</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}