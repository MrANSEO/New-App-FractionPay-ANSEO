// src/components/layout/Sidebar.tsx
import { Link } from 'react-router-dom';

interface Props {
  active: string;
}

export default function Sidebar({ active }: Props) {
  return (
    <div className="sidebar">
      <div className="sidebar-logo">FractionPay Admin</div>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <Link to="/admin" className={active === 'dashboard' ? 'active' : ''}>
              📊 Tableau de Bord
            </Link>
          </li>
          <li>
            <Link to="/admin/payments">💳 Paiements</Link>
          </li>
          <li>
            <Link to="/admin/apps">🏢 Applications</Link>
          </li>
          <li>
            <Link to="/admin/users">👥 Utilisateurs</Link>
          </li>
          <li>
            <Link to="/admin/settings">⚙️ Paramètres</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}