import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';

// Types
interface PaymentStep {
  amount: number;
  paymentProvider: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
}

interface Payment {
  paymentId: string;
  totalAmount: number;
  steps: PaymentStep[];
}

export default function PaymentPage() {
  const { paymentId } = useParams<{ paymentId: string }>();
  const navigate = useNavigate();
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);

  const loadPayment = async () => {
    if (!paymentId) return;
    try {
      const data: Payment = await api.get(`/payments/${paymentId}`);
      setPayment(data);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      alert('Paiement introuvable');
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentId]);

  const handlePay = async (step: PaymentStep) => {
    try {
      const response = await api.post<{ approveUrl: string }>(
        '/paypal/create-order',
        {
          paymentId,
          amount: step.amount,
        }
      );

      if (response.approveUrl) {
        window.location.href = response.approveUrl;
      } else {
        alert('Impossible de générer le lien de paiement');
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      alert(err.message || 'Échec du paiement');
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (!payment) return <div>Paiement non trouvé</div>;

  return (
    <div className="payment-page">
      <div className="order-summary">
        <h2>Récapitulatif</h2>
        <p>Total à payer : <strong>{payment.totalAmount} €</strong></p>
      </div>

      <div className="payment-steps">
        <h3>Étapes de paiement</h3>
        {payment.steps.map((step, i) => (
          <div key={i} className={`step-card ${step.status.toLowerCase()}`}>
            <div className="step-info">
              <strong>{step.paymentProvider}</strong>
              <span>{step.amount} €</span>
              <span className="status">{step.status}</span>
            </div>
            {step.status === 'PENDING' && (
              <button
                onClick={() => handlePay(step)}
                className="pay-btn"
                type="button"
              >
                Payer {step.amount} €
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}