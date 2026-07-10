import { useEffect, useState } from 'react';
import apiClient from '../lib/apiClient';
import { AuthResponse, LoginRequest } from '../types/api';

export type AuthRole = 'MEMBER' | 'LIBRARIAN' | 'ADMIN';

interface AuthUser {
  memberCode: string;
  role: AuthRole;
}

const isAuthRole = (value: unknown): value is AuthRole => {
  return value === 'MEMBER' || value === 'LIBRARIAN' || value === 'ADMIN';
};

const readUserFromToken = (): AuthUser | null => {
  const token = localStorage.getItem('accessToken');
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const role = payload.role || payload.roles?.[0]?.replace('ROLE_', '');
    if (!payload.sub || !isAuthRole(role)) return null;
    return { memberCode: payload.sub, role };
  } catch (error) {
    console.error('Invalid token format', error);
    return null;
  }
};

export const login = async (payload: LoginRequest): Promise<AuthUser> => {
  const { data } = await apiClient.post<AuthResponse>('/auth/login', payload);
  localStorage.setItem('accessToken', data.accessToken);
  localStorage.setItem('refreshToken', data.refreshToken);
  return { memberCode: data.memberCode, role: data.role };
};

export const logout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  window.location.href = '/login';
};

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setUser(readUserFromToken());
    setIsReady(true);
  }, []);

  return {
    user,
    logout,
    isReady,
    isAuthenticated: Boolean(user),
  };
};

export default useAuth;
