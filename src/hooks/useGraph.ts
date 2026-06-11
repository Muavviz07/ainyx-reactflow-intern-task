import { useQuery } from '@tanstack/react-query';
import { mockApi } from '@/mocks/handlers';

export function useGraph(appId: string | null) {
  return useQuery({
    queryKey: ['graph', appId],
    queryFn: () => {
      if (!appId) throw new Error('App ID is required to fetch graph');
      return mockApi.getGraph(appId);
    },
    enabled: !!appId,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}
