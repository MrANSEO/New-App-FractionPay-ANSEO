// src/pages/admin/Payments.tsx
import { useEffect, useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import Header from '../../components/layout/Header';
import PaymentTable from '../../components/ui/PaymentTable';
import { api } from '../../services/api';

import type { Payment } from '../../store';

export default function Payments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      const data = await api.get('/payments');
      setPayments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Erreur lors du chargement des paiements', err);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Sidebar active="payments" />
      <div className="main-content">
        <Header title="Gestion des Paiements" />
        <div className="section">
          <h2 className="section-title">Liste des Transactions</h2>
          {loading ? (
            <p>Chargement des paiements...</p>
          ) : payments.length === 0 ? (
            <p>Aucun paiement trouvé.</p>
          ) : (
            <PaymentTable payments={payments} />
          )}
        </div>
      </div>
    </>
  );
}