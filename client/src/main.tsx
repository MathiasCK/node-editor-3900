import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './global.css';
import { Toaster } from 'react-hot-toast';
import { Navbar, Spinner } from './components/ui';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Toaster />
    <Spinner size={40} />
    <Navbar />
    <main
      style={{ height: 'calc(100vh - 5rem)' }}
      className="h-screen w-screen"
    >
      <App />
    </main>
  </React.StrictMode>
);
