import { CSSTransition } from 'react-transition-group';
import { AppPage } from '@/lib/types';
import { Login, Home, Register } from '@/pages';
import { useEffect } from 'react';
import { useTheme, useSession } from '@/hooks';
import { Toaster } from 'react-hot-toast';
import { Navbar, Loader } from './components/ui';

const routeConfig = {
  [AppPage.Login]: Login,
  [AppPage.Register]: Register,
  [AppPage.Home]: Home,
};

const App: React.FC = () => {
  const { theme } = useTheme();
  const { token, register, currentPage, setCurrentPage } = useSession();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    if (!token) {
      return setCurrentPage(AppPage.Login);
    }
    if (register) {
      return setCurrentPage(AppPage.Register);
    }
    setCurrentPage(AppPage.Home);
  }, [register, setCurrentPage, token]);

  return (
    <>
      <Toaster />
      <Navbar />
      {Object.entries(routeConfig).map(([page, Component]) => (
        <CSSTransition
          key={page}
          in={page === currentPage}
          timeout={300}
          classNames="page"
          unmountOnExit
        >
          <main className="page h-screen w-screen">
            <Loader />
            <Component />
          </main>
        </CSSTransition>
      ))}
    </>
  );
};

export default App;
