import { Navigate } from 'react-router-dom';
import { useState, SyntheticEvent } from 'react';
import { login } from '@/api/user';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [navigate, setNavigate] = useState(false);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    await login(username, password);
    setNavigate(true);
  };

  if (navigate) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex h-screen items-center justify-center bg-indigo-600">
      <div className="w-96 rounded-md bg-white p-6 shadow-lg">
        <form onSubmit={handleSubmit}>
          <h1 className="block text-center text-3xl font-bold text-black">
            <i className="fa-solid fa-user"></i>Login
          </h1>
          <div className="mt-3">
            <input
              type="text"
              id="username"
              className="w-full border px-2 py-1 text-base text-black focus:border-gray-600 focus:outline-none focus:ring-0"
              placeholder="Username"
              required
              onChange={e => setUsername(e.target.value)}
            />
          </div>
          <div className="mt-3">
            <input
              type="password"
              id="password"
              className="w-full border px-2 py-1 text-base text-black focus:border-gray-600 focus:outline-none focus:ring-0"
              placeholder="Password"
              required
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <div className="mt-5">
            <button
              type="submit"
              className='font-semibold"><i class="fa-solid fa-right-to-bracket w-full rounded-md border-2 border-indigo-700 bg-indigo-700 py-1 text-white hover:bg-transparent hover:text-indigo-700'
            >
              Login
            </button>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div>
              <input type="checkbox" />
              <label className="text-black"> Remember me</label>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div>
              <a href="#" className="font-semibold text-indigo-800">
                Forgot password?
              </a>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div>
              <p className="text-black">
                Dont't have an account?{' '}
                <a href="register" className="font-semibold text-indigo-800">
                  Register
                </a>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
