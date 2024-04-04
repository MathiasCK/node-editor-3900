import toast from 'react-hot-toast';

export const login = async (username: string, password: string) => {
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
      throw new Error('Login failed');
    }

    const data = await response.json();

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  } catch (error) {
    toast.error('Login failed');
  }
};

export const register = async (username: string, password: string) => {
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
      throw new Error('Registration failed');
    }

    const data = await response.json();

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  } catch (error) {
    toast.error('Registration failed');
  }
};

export const logout = async () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.reload();
};
