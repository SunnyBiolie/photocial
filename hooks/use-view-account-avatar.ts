import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface ViewFullState {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  imageURL: string | undefined;
  setImageURL: (url: string) => void;
}

export const useViewAccountAvatar = create<ViewFullState>()(
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

        imageURL: undefined,
        setImageURL: (url: string) => {
          set({ imageURL: url });
        },
      }),
      {
        name: "view-full-state",
      }
    )
  )
);
