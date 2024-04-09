import { CSSTransition } from 'react-transition-group';
import { AppPage } from '@/lib/types';
import { Login, Home, Register } from '@/pages';
import { useEffect } from 'react';
import { useTheme, useSession } from '@/hooks';
import { useSnapshot } from 'valtio';
import { actions, state } from './pages/state';

const routeConfig = {
  [AppPage.Login]: Login,
  [AppPage.Register]: Register,
  [AppPage.Home]: Home,
};

const App: React.FC = () => {
  const snap = useSnapshot(state);
  const { theme } = useTheme();
  const { token } = useSession();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  if (token && snap.currentPage === AppPage.Register) {
    actions.setCurrentPage(AppPage.Register);
  } else if (token) {
    actions.setCurrentPage(AppPage.Home);
  } else {
    actions.setCurrentPage(AppPage.Login);
  }

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

export default App;
