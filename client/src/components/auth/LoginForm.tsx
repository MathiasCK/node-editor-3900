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
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useToken } from '@/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { pageTransition, pageVariants } from '@/lib/animations';

const formSchema = z.object({
  username: z.string().min(2, 'Username must contain at least 2 character(s)'),
  password: z.string().min(2, 'Password must contain at least 2 character(s)'),
});

const LoginForm = () => {
  const { setToken } = useToken();
  const [isExiting, setIsExiting] = useState<boolean>(false);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    const success = await login(values.username, values.password, setToken);

    if (success) {
      setIsExiting(true);

      setTimeout(() => navigate('/'), 500);
    }
  };

  const queryParams = new URLSearchParams(window.location.search);
  const expired = queryParams.get('expired');

  useEffect(() => {
    if (expired) {
      toast.error('Session expired. Please login again.');
      navigate('/login');
    }
  }, [expired, navigate]);

  return (
    <motion.section
      initial="initial"
      animate={isExiting ? 'out' : 'in'}
      variants={pageVariants}
      transition={pageTransition}
      className="dark flex h-screen w-screen items-center justify-center bg-black"
    >
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="username" {...field} />
                    </FormControl>
                    <FormMessage className="text-red-500" />
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
                      <Input
                        type="password"
                        placeholder="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <div className="mt-6 flex justify-center">
                <Button type="submit">Login</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.section>
  );
};

export default LoginForm;
