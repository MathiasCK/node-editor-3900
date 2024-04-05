import { Navigate, Outlet } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { logout, validateToken } from '@/api/auth';
import { Spinner } from '../ui';
import { UserWithToken } from '@/lib/types';
import toast from 'react-hot-toast';
import { useToken } from '@/hooks';

const AdminRoute = () => {
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
    const path = logout();
    return <Navigate to={path} replace />;
  }

  if ((data as UserWithToken).user.username !== 'admin') {
    toast.error('Access denied. Only admin can access this route.');
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default AdminRoute;
