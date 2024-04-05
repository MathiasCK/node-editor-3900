import { register } from '@/api/auth';
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
import { useNavigate } from 'react-router-dom';
import { useToken } from '@/hooks';

const formSchema = z
  .object({
    username: z
      .string()
      .min(2, 'Username must contain at least 2 character(s)')
      .max(50, "Username can't be longer than 50 characters"),
    password: z
      .string()
      .min(5, 'Password must contain at least 5 character(s)')
      .max(50, "Password can't be longer than 50 characters"),
    repeatPassword: z
      .string()
      .min(5, 'Password must contain at least 5 character(s)')
      .max(50, "Password can't be longer than 50 characters"),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.repeatPassword) {
      ctx.addIssue({
        path: ['repeatPassword'],
        message: 'Passwords do not match',
        code: 'custom',
      });
    }
  });

const RegisterForm = () => {
  const { setToken } = useToken();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
      repeatPassword: '',
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) =>
    register(values.username, values.password, setToken, () => {
      navigate('/');
    });

  return (
    <div className="flex h-screen items-center justify-center bg-indigo-600">
      <div className="w-96 rounded-md bg-white p-6 shadow-lg">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <h1 className="block text-center text-3xl font-bold text-black">
              <i className="fa-solid fa-user"></i>Register
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
            <FormField
              control={form.control}
              name="repeatPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Repeat password</FormLabel>
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
                Submit
              </button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default RegisterForm;
