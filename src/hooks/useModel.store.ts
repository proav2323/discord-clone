import { create } from "zustand";

export type modelType = "createServer" | "editServer" | "createChannel";

interface modelStore {
  type: modelType | null;
  isOpen: boolean;
  onOpen: (type: modelType) => void;
  onClose: () => void;
}

export const useModal = create<modelStore>((set) => ({
  type: null,
  isOpen: false,
  onOpen: (type: modelType) => set({ isOpen: true, type: type }),
  onClose: () => set({ type: null, isOpen: false }),
}));
