import { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import Header from '../../components/layout/Header';
import { api } from '../../services/api';

interface App {
  id: string;
  name: string;
  apiKey: string;
  status: string;
}

export default function Apps() {
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApps();
  }, []);

  const loadApps = async () => {
    try {
      const data = await api.get('/application');
      setApps(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load apps', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-layout">
      <Sidebar active="apps" />
      <div className="main-content">
        <Header title="Gestion des Applications" />
        <div className="section">
          <h2>Applications Clients</h2>
          {loading ? (
            <p>Chargement...</p>
          ) : (
            <table className="app-table">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Clé API</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {apps.map(app => (
                  <tr key={app.id}>
                    <td>{app.name}</td>
                    <td><code>{app.apiKey}</code></td>
                    <td><span className={`status-badge ${app.status.toLowerCase()}`}>{app.status}</span></td>
                    <td><button className="btn btn-sm">Détails</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}