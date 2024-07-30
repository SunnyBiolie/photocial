import { DialogProps } from "@/types/others";
import { create } from "zustand";

interface Props {
  dialogData: DialogProps | undefined;
  setDialogData: (data: DialogProps | undefined) => void;
}

export const useViewDialog = create<Props>()((set) => ({
  dialogData: undefined,
  setDialogData: (data: DialogProps | undefined) => {
    set({ dialogData: data });
  },
}));
