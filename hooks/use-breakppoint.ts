import { create } from "zustand";

type Props = {
  isMedium: boolean | undefined;
  setIsMedium: (isMedium: boolean | undefined) => void;
};

export const useBreakpoint = create<Props>()((set) => ({
  isMedium: undefined,
  setIsMedium: (isMedium: boolean | undefined) => {
    set({ isMedium });
  },
}));
