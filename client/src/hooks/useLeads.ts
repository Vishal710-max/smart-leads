import { useState, useEffect, useCallback } from 'react';
import { getLeadsApi } from '../api/leads';
import { ILead, PaginationMeta, LeadFilters } from '../types/lead';
import { useDebounce } from './useDebounce';

const defaultFilters: LeadFilters = {
  status: '',
  source: '',
  search: '',
  sort: 'latest',
  page: 1,
};

export function useLeads() {
  const [leads, setLeads] = useState<ILead[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [filters, setFilters] = useState<LeadFilters>(defaultFilters);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearch = useDebounce(filters.search, 400);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getLeadsApi({ ...filters, search: debouncedSearch });
      setLeads(res.data);
      setPagination(res.pagination);
    } catch {
      setError('Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  }, [filters, debouncedSearch]);

  useEffect(() => {
    void fetchLeads();
  }, [fetchLeads]);

  const updateFilter = (key: keyof LeadFilters, value: string | number) => {
    setFilters((prev) => {
      const nextFilters = { ...prev, [key]: value } as LeadFilters;
      if (key !== 'page') {
        nextFilters.page = 1;
      } else {
        nextFilters.page = Number(value);
      }
      return nextFilters;
    });
  };

  const resetFilters = () => setFilters(defaultFilters);

  return { leads, pagination, filters, loading, error, updateFilter, resetFilters, refetch: fetchLeads };
}
