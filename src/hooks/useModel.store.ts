import { Channel, Server, channelType } from "@prisma/client";
import { create } from "zustand";

export type modelType =
  | "createServer"
  | "editServer"
  | "createChannel"
  | "invite"
  | "members"
  | "Leave Server"
  | "delete Server"
  | "delete channel"
  | "edit channel";

interface modelStore {
  type: modelType | null;
  data: modelData;
  isOpen: boolean;
  onOpen: (type: modelType, data?: modelData) => void;
  onClose: () => void;
}

interface modelData {
  server?: Server;
  ChannelType?: channelType;
  channel?: Channel;
}

export const useModal = create<modelStore>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type: modelType, data = {}) =>
    set({ isOpen: true, type: type, data: data }),
  onClose: () => set({ type: null, isOpen: false }),
}));
