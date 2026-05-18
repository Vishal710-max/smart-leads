export enum LeadStatus {
  New = 'new',
  Contacted = 'contacted',
  Qualified = 'qualified',
  Lost = 'lost',
}

export enum LeadSource {
  Website = 'website',
  Instagram = 'instagram',
  Referral = 'referral',
}

export interface ILead {
  _id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdBy: { name: string; email: string };
  createdAt: string;
  updatedAt: string;
}

export interface LeadFormData {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface LeadsResponse {
  success: boolean;
  data: ILead[];
  pagination: PaginationMeta;
}

export interface LeadFilters {
  status: string;
  source: string;
  search: string;
  sort: 'latest' | 'oldest';
  page: number;
}
