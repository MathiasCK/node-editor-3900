import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './global.css';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Navbar } from './components/ui';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <Navbar />
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
