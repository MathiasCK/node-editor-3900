import { UserWithToken } from '@/lib/types';
import toast from 'react-hot-toast';

export const login = async (
  username: string,
  password: string
): Promise<UserWithToken | null> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/auth/login`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          password,
        }),
      }
    );

    if (!response.ok) {
      const errorBody = await response.text();
      const errorMessage = errorBody || 'Error user edge. Please try again.';

      toast.error(errorMessage);
      return null;
    }

    const data = (await response.json()) as UserWithToken;

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    return data;
  } catch (error) {
    toast.error('Error creating user. Please try again.');
    throw new Error(`Error creating user: ${error}`);
  }
};

export const register = async (
  username: string,
  password: string
): Promise<UserWithToken | null> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/auth/register`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          password,
        }),
      }
    );

    if (!response.ok) {
      const errorBody = await response.text();
      const errorMessage = errorBody || 'Error user edge. Please try again.';

      toast.error(errorMessage);
      return null;
    }

    const data = (await response.json()) as UserWithToken;

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    window.location.href = '/';
    return data;
  } catch (error) {
    toast.error('Error creating user. Please try again.');
    throw new Error(`Error creating user: ${error}`);
  }
};

export const logout = (sessionExpired = false): string => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  return sessionExpired ? '/login?expired=true' : '/login';
};

export const validateToken = async (): Promise<boolean | UserWithToken> => {
  const token = localStorage.getItem('token');

  if (!token) return false;

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/auth/token`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
        }),
      }
    );

    if (!response.ok) {
      return false;
    }

    const decodedToken = token ? JSON.parse(atob(token.split('.')[1])) : null;

    const isExpired = decodedToken
      ? decodedToken.exp < Date.now() / 1000
      : true;

    if (isExpired) return false;

    return {
      token: token,
      user: {
        username: decodedToken.unique_name,
        id: decodedToken.UserId,
      },
    };
  } catch (error) {
    return false;
  }
};
