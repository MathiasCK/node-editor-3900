import { CSSTransition } from 'react-transition-group';
import { AppPage } from '@/lib/types';
import Login from './Login';
import Home from './Home';
import Register from './Register';
import { useCallback, useEffect } from 'react';
import { useTheme, useToken } from '@/hooks';
import { actions, state } from './state';
import { useSnapshot } from 'valtio';

const routeConfig = {
  [AppPage.Login]: Login,
  [AppPage.Register]: Register,
  [AppPage.Home]: Home,
};

const Pages: React.FC = () => {
  const snap = useSnapshot(state);
  const { removeToken } = useToken();
  const { theme } = useTheme();

  const handleUnathorized = useCallback(() => {
    actions.logout('UNAHTORIZED');
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    window.addEventListener('unauthorized', handleUnathorized);

    return () => {
      window.removeEventListener('unauthorized', handleUnathorized);
    };
  }, [handleUnathorized, removeToken]);
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
