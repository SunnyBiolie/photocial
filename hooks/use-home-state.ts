import { create } from "zustand";
import { Account, Post } from "@prisma/client";

type PostProps = {
  post: Post;
  author?: Account;
  likeStatus?: boolean;
  likeCounts?: number;
  commentCounts?: number;
};

type HomeState = {
  data: PostProps[] | undefined;
  setData: (data: PostProps[] | undefined) => void;
  scrollPosition: number;
  setScrollPosition: (scrollPosition: number) => void;
};

export const useHomeState = create<HomeState>()((set) => ({
  data: undefined,
  setData: (data: PostProps[] | undefined) => {
    set({ data });
  },
  scrollPosition: 0,
  setScrollPosition: (scrollPosition: number) => {
    set({ scrollPosition });
  },
}));
