import qs from "query-string";
import { useParams } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSocket } from "@/components/providers/socket-provider";
import { NextRequest } from "next/server";

interface chatQueryProps {
  queryKey: string;
  apiUrl: string;
  paramsKey: "channelId" | "conversationId";
  paramVlaue: string;
}

export const useChatQuery = ({
  queryKey,
  apiUrl,
  paramVlaue,
  paramsKey,
}: chatQueryProps) => {
  const { isConnected } = useSocket();

  const fetchMessages = async ({ pageParam = undefined }) => {
    const url = qs.stringifyUrl(
      {
        url: apiUrl,
        query: {
          cursor: pageParam,
          [paramsKey]: paramVlaue,
        },
      },
      { skipNull: true }
    );

    const res = await fetch(url);
    return res.json();
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useInfiniteQuery({
    queryKey: [queryKey],
    queryFn: fetchMessages,
    getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
    initialPageParam: undefined,
    refetchInterval: isConnected ? false : 1000,
  });

  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  };
};
