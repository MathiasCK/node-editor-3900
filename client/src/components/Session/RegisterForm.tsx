import { useState, SyntheticEvent } from 'react';
import { Navigate } from 'react-router-dom';

const RegisterForm = () => {
  const [usernameReg, setUsernameReg] = useState('');
  const [passwordReg, setPasswordReg] = useState('');
  const [navigate, setNavigate] = useState(false);

  const register = () => {
    Axios.post('http://localhost3001/register', {
      username: usernameReg,
      password: passwordReg,
    }).then(response => {
      console.log(response);
      setNavigate(true);
    });
  };
  /*
const RegisterForm = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [navigate, setNavigate] = useState(false);

  //Stored in Local Storage before backe-end is implemented.
  const submit = async (e: SyntheticEvent) => {
    e.preventDefault();

    console.log({
      name,
      username,
      password,
    });
    setNavigate(true);
  };

  /* This is the code for when the back-end/Database will be implemented:
    const submit = async (e: SyntheticEvent) => {
        e.preventDefault();

        await fetch('http://localhost:8000/register', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                name,
                username,
                password
            })
        }); 

        setNavigate(true);
    } */

  //Navigation when clicking submit back to LoginForm
  if (navigate) {
    return <Navigate to="/loginform" />;
  }

  return (
    <div className="flex h-screen items-center justify-center bg-indigo-600">
      <div className="w-96 rounded-md bg-white p-6 shadow-lg">
        <form onSubmit={submit}>
          <h1 className="block text-center text-3xl font-bold text-black">
            <i className="fa-solid fa-user"></i>Register
          </h1>
          <div className="mt-3">
            <input
              type="text"
              id="name"
              className="w-full border px-2 py-1 text-base text-black focus:border-gray-600 focus:outline-none focus:ring-0"
              placeholder="Name"
              required
              onChange={e => setName(e.target.value)}
            />
          </div>
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
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
