import { useSocket } from "@/components/providers/socket-provider";
import { Member, Message, Profile } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { add } from "date-fns";
import { useEffect } from "react";

type chatSocketProps = {
  addKey: string;
  updatekey: string;
  queryKey: string;
};

type MessageWithMemberWithProfile = Message & {
  member: Member & {
    profile: Profile;
  };
};

export const useChatSocket = ({
  addKey,
  updatekey,
  queryKey,
}: chatSocketProps) => {
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on(updatekey, (message: MessageWithMemberWithProfile) => {
      queryClient.setQueryData([queryKey], (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          return oldData;
        }

        const newdata = oldData.pages.map((page: any) => {
          return {
            ...page,
            items: page.items.map((item: MessageWithMemberWithProfile) => {
              if (item.id === message.id) {
                return message;
              }
              return item;
            }),
          };
        });
        return { ...oldData, pages: newdata };
      });
    });

    socket.on(addKey, (message: MessageWithMemberWithProfile) => {
      queryClient.setQueryData([queryKey], (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          return { pages: [{ ietms: [message] }] };
        }

        const newdata = [...oldData.pages];

        newdata[0] = {
          ...newdata[0],
          items: [message, ...newdata[0].items],
        };
        return { ...oldData, pages: newdata };
      });
    });

    return () => {
      socket.off(addKey);
      socket.off(updatekey);
    };
  }, [addKey, queryKey, socket, updatekey, queryClient]);
};
