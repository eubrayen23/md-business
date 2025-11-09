import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@store/auth-store';
import { fetchMyProperties } from './api';

export const useMyProperties = () => {
  const { profile } = useAuthStore();

  return useQuery({
    queryKey: ['my-properties', profile?.id],
    queryFn: () => fetchMyProperties(profile?.id ?? ''),
    enabled: Boolean(profile?.id),
  });
};
