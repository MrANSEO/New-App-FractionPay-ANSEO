// src/pages/Payment/SuccessPage.tsx
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function SuccessPage() {
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get('paymentId');
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(`/payment/${paymentId}`);
    }, 3000);
    return () => clearTimeout(timer);
  }, [paymentId, navigate]);

  return (
    <div className="success-page">
      <h2>Paiement confirmé !</h2>
      <p>Le paiement a été approuvé. Redirection vers le suivi...</p>
      <div className="spinner"></div>
    </div>
  );
}