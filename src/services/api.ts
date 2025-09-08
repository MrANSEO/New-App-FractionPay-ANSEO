const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const getHeaders = () => {
  const token = localStorage.getItem('idToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

export const api = {
  get: async <T,>(url: string): Promise<T> => {
    const res = await fetch(`${API_BASE}${url}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Erreur API');
    return res.json();
  },
  post: async <T,>(url: string, body: unknown): Promise<T> => {
    const res = await fetch(`${API_BASE}${url}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error('Erreur API');
    return res.json();
  }
};