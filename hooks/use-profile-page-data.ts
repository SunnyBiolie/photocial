import { NumberOf } from "@/types/profile";
import { Post } from "@prisma/client";
import { create } from "zustand";

interface Props {
  listPostsOfCurrentAccount: Post[] | null | undefined;
  setListPostsOfCurrentAccount: (list: Post[] | null | undefined) => void;
  currentAccountNumberOf: NumberOf | undefined;
  setCurrentAccountNumberOf: (numberOf: NumberOf | undefined) => void;
  listSavedPostsOfCurrentAccount: Post[] | null | undefined;
  setListSavedPostsOfCurrentAccount: (list: Post[] | null | undefined) => void;
}

export const useProfilePageData = create<Props>()((set) => ({
  listPostsOfCurrentAccount: undefined,
  setListPostsOfCurrentAccount: (list: Post[] | null | undefined) => {
    set({ listPostsOfCurrentAccount: list });
  },
  currentAccountNumberOf: undefined,
  setCurrentAccountNumberOf: (numberOf) => {
    set({ currentAccountNumberOf: numberOf });
  },
  listSavedPostsOfCurrentAccount: undefined,
  setListSavedPostsOfCurrentAccount: (list: Post[] | null | undefined) => {
    set({ listSavedPostsOfCurrentAccount: list });
  },
}));
