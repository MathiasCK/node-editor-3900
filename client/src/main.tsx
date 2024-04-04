import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './global.css';
import { Toaster } from 'react-hot-toast';
import { Navbar, Spinner } from './components/ui';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import {
  LoginForm,
  RegisterForm,
  ProtectedRoute,
  AdminRoute,
} from './components/auth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const router = createBrowserRouter([
  {
    path: 'login',
    element: <LoginForm />,
  },
  {
    element: <AdminRoute />,
    children: [
      {
        path: '/register',
        element: <RegisterForm />,
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: (
          <>
            <Navbar />
            <App />
          </>
        ),
      },
    ],
  },
]);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <Spinner />
      <main
        style={{ height: 'calc(100vh - 4rem)' }}
        className="h-screen w-screen"
      >
        <RouterProvider router={router} />
      </main>
    </QueryClientProvider>
  </React.StrictMode>
);
