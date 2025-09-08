/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../services/api';

interface PaymentStep {
  paymentProvider: string;
  amount: number;
  status: 'PENDING' | 'SUCCESS' | string;
}

interface Payment {
  totalAmount: number;
  status: string;
  steps: PaymentStep[];
}

export default function PaymentPage() {
  const { paymentId } = useParams();
  // const navigate = useNavigate();
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadPayment = async () => {
      try {
        const data = await api.get(`/payments/${paymentId}`);
        setPayment(data as Payment);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError('Paiement introuvable');
      } finally {
        setLoading(false);
      }
    };
    if (paymentId) loadPayment();
  }, [paymentId]);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>{error}</div>;
  if (!payment) return null;

  const handlePay = async (step: PaymentStep) => {
    try {
      const response = await api.post('/paypal/create-order', {
        paymentId,
        amount: step.amount,
      });

      // Ensure response is typed
      const res = response as { approveUrl?: string };

      if (res.approveUrl) {
        window.location.href = res.approveUrl;
      } else {
        alert('Impossible de générer le lien de paiement');
      }
    } catch (err: any) {
      alert(err.message || 'Échec du paiement');
    }
  };

  return (
    <div className="payment-page">
      <div className="order-summary">
        <h2>Total à payer : {payment.totalAmount} €</h2>
        <p>Statut : {payment.status}</p>
      </div>

      <div className="payment-section">
        <h2>Méthodes de paiement disponibles</h2>
        <p>Payez chaque étape séparément :</p>

        {payment.steps.map((step, index) => (
          <div key={index} className="method-card">
            <div className="method-info">
              <strong>{step.paymentProvider}</strong>
              <span>{step.amount} €</span>
              <span className={`status-badge ${step.status.toLowerCase()}`}>
                {step.status}
              </span>
            </div>
            {step.status === 'PENDING' && (
              <button
                className="pay-btn"
                onClick={() => handlePay(step)}
              >
                Payer {step.amount} €
              </button>
            )}
            {step.status === 'SUCCESS' && (
              <span className="success-tag"> Payé</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}