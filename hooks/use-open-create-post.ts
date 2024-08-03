import { create } from "zustand";

interface Props {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useOpenCreatePost = create<Props>()((set) => ({
  isOpen: false,
  onOpen: () => {
    set({ isOpen: true });
    document.body.style.overflowY = "hidden";
  },
  onClose: () => {
    set({ isOpen: false });
    document.body.style.overflowY = "auto";
  },
}));
