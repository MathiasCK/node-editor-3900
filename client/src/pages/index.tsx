import { CSSTransition } from 'react-transition-group';
import { AppPage } from '@/lib/types';
import Login from './Login';
import Home from './Home';
import Register from './Register';
import { useEffect } from 'react';
import { useTheme } from '@/hooks';
import { state } from './state';
import { useSnapshot } from 'valtio';

const routeConfig = {
  [AppPage.Login]: Login,
  [AppPage.Register]: Register,
  [AppPage.Home]: Home,
};

const Pages: React.FC = () => {
  const snap = useSnapshot(state);

  const { theme } = useTheme();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <>
      {Object.entries(routeConfig).map(([page, Component]) => (
        <CSSTransition
          key={page}
          in={page === snap.currentPage}
          timeout={300}
          classNames="page"
          unmountOnExit
        >
          <main className="page h-screen w-screen">
            <Component />
          </main>
        </CSSTransition>
      ))}
    </>
  );
};

export default Pages;
