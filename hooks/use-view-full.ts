import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface ViewFullState {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  currentIndex: number | undefined;
  setCurrentIndex: (index: number) => void;
  listImages: string[] | undefined;
  setListImages: (urls: string[]) => void;
  aspectRatio: number | undefined;
  setAspectRatio: (ratio: number) => void;
}

export const useViewFull = create<ViewFullState>()(
  devtools(
    persist(
      (set) => ({
        isOpen: false,
        onOpen: () => {
          set({ isOpen: true });
          document.body.style.overflowY = "hidden";
        },
        onClose: () => {
          set({ isOpen: false });
          document.body.style.overflowY = "auto";
        },
        currentIndex: undefined,
        setCurrentIndex: (index) => {
          set({ currentIndex: index });
        },
        listImages: undefined,
        setListImages: (urls) => {
          set({ listImages: urls });
        },
        aspectRatio: undefined,
        setAspectRatio: (ratio) => {
          set({ aspectRatio: ratio });
        },
      }),
      {
        name: "view-full-state",
      }
    )
  )
);
