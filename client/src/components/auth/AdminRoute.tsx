import { Navigate, Outlet } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { logout, validateToken } from '@/api/auth';
import { Spinner } from '../ui';
import { UserWithToken } from '@/lib/types';

const AdminRoute = () => {
  const { isPending, error, data } = useQuery({
    queryKey: ['tokenData'],
    queryFn: async () => {
      const token = await validateToken();
      return token;
    },
  });

  if (isPending) return <Spinner />;

  if (
    error ||
    !data ||
    !(data as UserWithToken).token ||
    (data as UserWithToken).user.username !== 'admin'
  ) {
    const path = logout();
    return <Navigate to={path} replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
