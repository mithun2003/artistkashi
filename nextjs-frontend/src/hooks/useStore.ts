import { create } from "zustand";

type User = { id?: string; email?: string } | null;

type Store = {
  user: User;
  setUser: (u: User) => void;
};

export const useStore = create<Store>((set: any) => ({
  user: null,
  setUser: (u: User) => set({ user: u }),
}));

export default useStore;
