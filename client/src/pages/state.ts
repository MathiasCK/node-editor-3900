import { AppPage } from '@/lib/types';
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
};

export type AppActions = typeof actions;

export { state, actions };
