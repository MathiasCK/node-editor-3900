import { useSession } from '@/hooks';
import { UserWithToken } from '@/lib/types';
import toast from 'react-hot-toast';

export const login = async (
  username: string,
  password: string
): Promise<boolean> => {
  try {
    const { setUser, setToken } = useSession.getState();
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

    setUser(data.user);
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
