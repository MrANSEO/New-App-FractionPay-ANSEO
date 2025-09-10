// src/services/authService.ts
export interface LoginResponse {
  idToken: string;
  expiresIn: string;
}

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const res = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message || 'Identifiants invalides');
    }

    const data = await res.json();
    if (!data.idToken) throw new Error('Token manquant dans la réponse');

    return data;
  },
};