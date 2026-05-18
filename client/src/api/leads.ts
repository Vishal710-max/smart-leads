import api from './axios';
import { LeadsResponse, ILead, LeadFormData, LeadFilters } from '../types/lead';

export const getLeadsApi = async (filters: Partial<LeadFilters>): Promise<LeadsResponse> => {
  const params = new URLSearchParams();
  if (filters.status) params.set('status', filters.status);
  if (filters.source) params.set('source', filters.source);
  if (filters.search) params.set('search', filters.search);
  if (filters.sort) params.set('sort', filters.sort);
  if (filters.page) params.set('page', String(filters.page));
  const res = await api.get<LeadsResponse>(`/leads?${params.toString()}`);
  return res.data;
};

export const createLeadApi = async (data: LeadFormData): Promise<ILead> => {
  const res = await api.post<{ success: boolean; data: ILead }>('/leads', data);
  return res.data.data;
};

export const updateLeadApi = async (id: string, data: Partial<LeadFormData>): Promise<ILead> => {
  const res = await api.patch<{ success: boolean; data: ILead }>(`/leads/${id}`, data);
  return res.data.data;
};

export const deleteLeadApi = async (id: string): Promise<void> => {
  await api.delete(`/leads/${id}`);
};

export const exportLeadsApi = async (filters: Partial<LeadFilters>): Promise<void> => {
  const params = new URLSearchParams();
  if (filters.status) params.set('status', filters.status);
  if (filters.source) params.set('source', filters.source);
  if (filters.search) params.set('search', filters.search);
  const token = localStorage.getItem('token');
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/leads/export?${params.toString()}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'leads.csv';
  a.click();
  window.URL.revokeObjectURL(url);
};
