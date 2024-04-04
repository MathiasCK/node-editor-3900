import { UserWithToken } from '@/lib/types';
import toast from 'react-hot-toast';

export const login = async (
  username: string,
  password: string
): Promise<UserWithToken | null> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/users/login`,
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

export const register = async (
  username: string,
  password: string
): Promise<UserWithToken | null> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/users/register`,
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

export const logout = async () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.reload();
};
