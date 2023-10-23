import { Server } from "@prisma/client";
import { create } from "zustand";

export type modelType =
  | "createServer"
  | "editServer"
  | "createChannel"
  | "invite"
  | "members";

interface modelStore {
  type: modelType | null;
  data: modelData;
  isOpen: boolean;
  onOpen: (type: modelType, data?: modelData) => void;
  onClose: () => void;
}

interface modelData {
  server?: Server;
}

export const useModal = create<modelStore>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type: modelType, data = {}) =>
    set({ isOpen: true, type: type, data: data }),
  onClose: () => set({ type: null, isOpen: false }),
}));
