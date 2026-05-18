import api from './axios';
import { AuthResponse, LoginForm, RegisterForm } from '../types/auth';

export const loginApi = async (data: LoginForm): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>('/auth/login', data);
  return res.data;
};

export const registerApi = async (data: RegisterForm): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>('/auth/register', data);
  return res.data;
};

export const getMeApi = async () => {
  const res = await api.get('/auth/me');
  return res.data;
};
