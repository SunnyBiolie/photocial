import { Account } from "@prisma/client";
import { create } from "zustand";

interface Props {
  recommended: Account[] | null | undefined;
  setRecommended: (list: Account[] | null | undefined) => void;
}

export const useSearchPageData = create<Props>()((set) => ({
  recommended: undefined,
  setRecommended: (list: Account[] | null | undefined) => {
    set({ recommended: list });
  },
}));
