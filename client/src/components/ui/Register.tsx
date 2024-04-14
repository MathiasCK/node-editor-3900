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
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { useSession } from '@/hooks';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Role } from '@/lib/types';
import { queryClient } from '@/main';

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
    role: z.enum(['user', 'admin']),
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

const Register = () => {
  const { setDashboard } = useSession();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
      repeatPassword: '',
      role: 'user',
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    const registered = await register(
      values.username,
      values.password,
      values.role
    );

    if (registered) {
      toast.success(`User ${values.username} registered successfully`);
      form.reset();
      queryClient.invalidateQueries({
        queryKey: ['users'],
      });
    }
  };

  return (
    <Card className="mt-4 w-[350px] bg-white dark:bg-black">
      <CardHeader></CardHeader>
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
                    <Input type="password" placeholder="password" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-500" />
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
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <Select
                      {...field}
                      value={form.getValues('role')}
                      onValueChange={value =>
                        form.setValue('role', value as Role)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={form.getValues('role')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <div className="mt-6 flex justify-center">
              <Button type="submit">Register</Button>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <Button
          className="text-muted-foreground"
          variant="link"
          onClick={() => {
            setDashboard(false);
          }}
        >
          Back home?
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Register;
