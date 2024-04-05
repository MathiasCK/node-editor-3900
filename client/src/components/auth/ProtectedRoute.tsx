import { Navigate, Outlet } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { logout, validateToken } from '@/api/auth';
import { Spinner } from '../ui';
import { UserWithToken } from '@/lib/types';
import { useToken } from '@/hooks';

const ProtectedRoute = () => {
  const { token } = useToken();
  const { isPending, error, data } = useQuery({
    queryKey: ['tokenData'],
    queryFn: async () => {
      const validToken = await validateToken(token);
      return validToken;
    },
  });

  if (isPending) return <Spinner />;

  if (error || !data || !(data as UserWithToken).token) {
    const path = logout(true);
    return <Navigate to={path} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
