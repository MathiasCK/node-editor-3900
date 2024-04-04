import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const localStorageToken = localStorage.getItem('token');

  const decodedToken = localStorageToken
    ? JSON.parse(atob(localStorageToken.split('.')[1]))
    : null;

  const isExpired = decodedToken ? decodedToken.exp < Date.now() / 1000 : true;

  if (isExpired) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
