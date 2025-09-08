export const authService = {
  login: async (email: string, password: string) => {
    const res = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) throw new Error('Identifiants invalides');

    const data = await res.json();
    return data.idToken;
  },
  logout: () => {
    localStorage.removeItem('idToken');
  },
  isAuthenticated: () => !!localStorage.getItem('idToken')
};