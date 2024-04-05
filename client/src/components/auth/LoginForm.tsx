import { login } from '@/api/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import toast from 'react-hot-toast';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const formSchema = z.object({
  username: z.string().min(2, 'Username must contain at least 2 character(s)'),
  password: z.string().min(2, 'Password must contain at least 2 character(s)'),
});

const LoginForm = () => {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) =>
    login(values.username, values.password, navigate);

  const queryParams = new URLSearchParams(window.location.search);
  const expired = queryParams.get('expired');

  useEffect(() => {
    if (expired) {
      toast.error('Session expired. Please login again.');
      navigate('/login');
    }
  }, [expired, navigate]);

  return (
    <div className="flex h-screen items-center justify-center bg-indigo-600">
      <div className="w-96 rounded-md bg-white p-6 shadow-lg">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <h1 className="block text-center text-3xl font-bold text-black">
              <i className="fa-solid fa-user"></i>Login
            </h1>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="mt-5">
              <button
                type="submit"
                className='font-semibold"><i class="fa-solid fa-right-to-bracket w-full rounded-md border-2 border-indigo-700 bg-indigo-700 py-1 text-white hover:bg-transparent hover:text-indigo-700'
              >
                Login
              </button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default LoginForm;
