import { create } from "zustand";

type LoadingState = {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
};

const useLoading = create<LoadingState>()(set => ({
  isLoading: false,
  startLoading: () =>
    set({
      isLoading: true,
    }),
  stopLoading: () => set({ isLoading: false }),
}));

export default useLoading;
