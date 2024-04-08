import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { logout, validateToken } from '@/api/auth';

import { UserWithToken } from '@/lib/types';
import { useToken } from '@/hooks';
import { Spinner } from '../ui';
import { useEffect } from 'react';

const ProtectedRoute = () => {
  const { token } = useToken();
  const navigate = useNavigate();

  const { isPending, error, data } = useQuery({
    queryKey: ['tokenData', token],
    queryFn: () => validateToken(token),
  });

  useEffect(() => {
    const handleUnathorized = () => {
      const path = logout(true);
      navigate(path);
    };

    window.addEventListener('unauthorized', handleUnathorized);

    return () => {
      window.removeEventListener('unauthorized', handleUnathorized);
    };
  }, [navigate]);

  if (isPending) {
    return <Spinner />;
  }

  if (data == null) {
    const path = logout();
    return <Navigate to={path} replace />;
  }

  if (error || data === false || !(data as UserWithToken).token) {
    const path = logout(true);
    return <Navigate to={path} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
