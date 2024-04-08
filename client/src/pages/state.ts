import { AppPage } from '@/lib/types';
import toast from 'react-hot-toast';
import { proxy } from 'valtio';

export type AppState = {
  currentPage: AppPage;
};

const state = proxy<AppState>({
  currentPage: AppPage.Login,
});

const actions = {
  setCurrentPage: (page: AppPage) => {
    state.currentPage = page;
  },
  logout: (type?: 'UNAHTORIZED' | 'EXPIRED') => {
    localStorage.removeItem('token-storage');
    setTimeout(() => {
      state.currentPage = AppPage.Login;
      if (type === 'UNAHTORIZED') {
        toast.error('Unauthorized');
      }
      if (type === 'EXPIRED') {
        toast.error('Session expired');
      }
    }, 300);
  },
};

export type AppActions = typeof actions;

export { state, actions };
