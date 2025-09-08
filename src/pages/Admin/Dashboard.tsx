import { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import Header from '../../components/layout/Header';
import StatCard from '../../components/ui/StatCard';
import PaymentTable from '../../components/ui/PaymentTable';
import { api } from '../../services/api';
import { Payment } from '../../store';

export default function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    volume: 0,
    successRate: 0,
    newClients: 0
  });
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await api.get<Payment[]>('/payments');
        setPayments(data);

        const total = data.length;
        const successful = data.filter(p => p.status === 'SUCCESS').length;
        const volume = data.reduce((sum, p) => 
          sum + p.steps.reduce((s, step) => s + step.amount, 0), 0
        );

        setStats({
          total,
          volume,
          successRate: total ? Math.round((successful / total) * 100) : 0,
          newClients: 12
        });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        console.error('Failed to load dashboard data');
      }
    };

    loadDashboard();
  }, []);

  return (
    <div className="admin-layout">
      <Sidebar active="dashboard" />
      <div className="main-content">
        <Header title="Tableau de Bord" />
        <div className="dashboard-stats">
          <StatCard title="Total Transactions" value={stats.total} trend="+12%" />
          <StatCard title="Volume Traitée" value={`€${stats.volume.toFixed(2)}`} trend="+8%" />
          <StatCard title="Taux de Succès" value={`${stats.successRate}%`} trend="Stable" />
          <StatCard title="Nouveaux Clients" value={stats.newClients} trend="+15%" />
        </div>
        <div className="section">
          <h2>Transactions Récentes</h2>
          <PaymentTable payments={payments.slice(0, 5)} />
        </div>
      </div>
    </div>
  );
}