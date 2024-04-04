import toast from 'react-hot-toast';

export const login = async (username: string, password: string) => {
  try {
    const response = await fetch('http://localhost:5000/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.text();
    localStorage.setItem('token', data);
  } catch (error) {
    toast.error('Login failed');
  }
};

export const register = async (username: string, password: string) => {
  try {
    const response = await fetch('http://localhost:5000/api/users/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    const data = await response.text();
    localStorage.setItem('token', data);

    if (!response.ok) {
      throw new Error('Registration failed');
    }
  } catch (error) {
    toast.error('Registration failed');
  }
};

export const logout = async () => {
  localStorage.removeItem('token');
  window.location.reload();
};
