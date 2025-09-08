// src/components/layout/Header.tsx
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';

export default function Header({ title }: { title: string }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div className="header">
      <h1>{title}</h1>
      <div className="user-info">
        <span>Administrateur</span>
        <img
          src="https://via.placeholder.com/45/3498db/FFFFFF?text=AD"
          alt="Avatar"
          onClick={handleLogout}
          style={{ cursor: 'pointer' }}
        />
      </div>
    </div>
  );
}