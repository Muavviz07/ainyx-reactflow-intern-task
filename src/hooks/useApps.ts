import { useQuery } from '@tanstack/react-query';
import { mockApi } from '@/mocks/handlers';

export function useApps() {
  return useQuery({
    queryKey: ['apps'],
    queryFn: () => mockApi.getApps(),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}
