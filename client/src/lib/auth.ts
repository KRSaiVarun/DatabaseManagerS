import { apiRequest } from './queryClient';
import { User } from '@shared/schema';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  phone?: string;
  password: string;
  confirmPassword: string;
}

export async function loginUser(credentials: LoginCredentials): Promise<User> {
  const res = await apiRequest('POST', '/api/auth/login', credentials);
  const data = await res.json();
  return data;
}

export async function registerUser(credentials: RegisterCredentials): Promise<User> {
  const res = await apiRequest('POST', '/api/auth/register', credentials);
  const data = await res.json();
  return data;
}

export async function socialLogin(provider: 'google' | 'facebook', token: string): Promise<User> {
  const res = await apiRequest('POST', `/api/auth/${provider}`, { token });
  const data = await res.json();
  return data;
}

export async function adminLogin(credentials: LoginCredentials): Promise<User> {
  const res = await apiRequest('POST', '/api/auth/admin/login', credentials);
  const data = await res.json();
  return data;
}

export async function logout(): Promise<void> {
  await apiRequest('POST', '/api/auth/logout', {});
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const res = await fetch('/api/auth/me', {
      credentials: 'include',
    });
    
    if (!res.ok) {
      if (res.status === 401) {
        return null;
      }
      throw new Error('Failed to get current user');
    }
    
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}
