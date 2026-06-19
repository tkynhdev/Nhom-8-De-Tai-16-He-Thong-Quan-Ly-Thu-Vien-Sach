import { useState, useEffect } from 'react';

interface AuthUser {
  memberCode: string;
  role: 'MEMBER' | 'LIBRARIAN' | 'ADMIN';
}

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const role = payload.roles?.[0]?.replace('ROLE_', '') || payload.role || 'MEMBER';
        setUser({ memberCode: payload.sub, role });
      } catch (error) {
        console.error('Invalid token format', error);
        setUser(null);
      }
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
  };

  return { user, logout, isAuthenticated: !!user };
};

export default useAuth;
