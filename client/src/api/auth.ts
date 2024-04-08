import { UserWithToken } from '@/lib/types';
import { actions } from '@/pages/state';
import toast from 'react-hot-toast';

export const login = async (
  username: string,
  password: string,
  setToken: (token: string) => void
): Promise<boolean> => {
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
      const errorMessage = errorBody || 'Error logging in. Please try again.';

      toast.error(errorMessage);
      return false;
    }

    const data = (await response.json()) as UserWithToken;

    setToken(data.token);

    return true;
  } catch (error) {
    toast.error('Error logging in. Please try again.');
    throw new Error(`Error logging in: ${error}`);
  }
};

export const register = async (
  username: string,
  password: string
): Promise<boolean> => {
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
      const errorMessage =
        errorBody || 'Error registering user. Please try again.';

      toast.error(errorMessage);
      return false;
    }
    return true;
  } catch (error) {
    toast.error('Error registering user. Please try again.');
    throw new Error(`Error registering user: ${error}`);
  }
};

export const validateToken = async (
  token: string | undefined
): Promise<boolean | null | UserWithToken> => {
  if (!token) return null;

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

    if (isExpired) {
      actions.logout('EXPIRED');
      return false;
    }

    return {
      token: token,
      user: {
        username: decodedToken.unique_name,
        id: decodedToken.UserId,
        role: decodedToken.role,
      },
    };
  } catch (error) {
    return false;
  }
};
