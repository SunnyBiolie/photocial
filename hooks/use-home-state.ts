import { create } from "zustand";
import { PostCardProps } from "@/types/others";

type Props = {
  postCards: PostCardProps[] | null | undefined;
  setPostCards: (data: PostCardProps[] | null | undefined) => void;
  scrollPosition: number;
  setScrollPosition: (scrollPosition: number) => void;
};

export const useHomePageData = create<Props>()((set) => ({
  postCards: undefined,
  setPostCards: (data) => {
    set({ postCards: data });
  },
  scrollPosition: 0,
  setScrollPosition: (scrollPosition: number) => {
    set({ scrollPosition });
  },
}));
