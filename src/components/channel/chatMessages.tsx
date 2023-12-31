"use client"

import { Member, Message, Profile } from "@prisma/client"
import ChatWelcome from "./ChatWelcome"
import { useChatQuery } from "@/hooks/useQueryChat"
import { Loader, ServerCrash } from "lucide-react"
import { Fragment, useRef, ElementRef } from "react"
import ChatItem from "./chatItem"
import {format} from 'date-fns'
import { useChatSocket } from "@/hooks/useChatSocket"
import { Button } from "../ui/button"
import { useChatScroll } from "@/hooks/useChatScroll"

type MessageWithMemberWithProfile = Message & {
    member: Member & {profile: Profile}
}

const DATE_FORMAT = "d MMMM yyyy HH:mm"

export default function ChatMessages({name, member, chatId, apiUrl, socketUrl, socketQuery, paramsKey, paramValue, type}: {name: string, member: Member, chatId: string, apiUrl: string, socketUrl: string, socketQuery: Record<string, string>, paramsKey: "channelId" | "conversationId", paramValue: string, type: "channel" | "conversation"}) {
    const queryKey = `chat:${chatId}`
    const addKey = `chat:${chatId}:messages`
    const updateKey = `chat:${chatId}messages:update`;
    const {data, fetchNextPage, isFetchingNextPage, hasNextPage, status, error} = useChatQuery({
        queryKey: queryKey,
        apiUrl: apiUrl,
        paramsKey: paramsKey,
        paramVlaue: paramValue
    });
    const chatRef = useRef<ElementRef<"div">>(null)
    const bottomRef = useRef<ElementRef<"div">>(null)
    useChatSocket({queryKey: queryKey, addKey: addKey, updatekey: updateKey})
    useChatScroll({chatRef: chatRef, bottomRef: bottomRef, loadMore: fetchNextPage, shouldLoadMore: !isFetchingNextPage && !!hasNextPage, count: data?.pages[0]?.items.length ?? 0});

    if (status === "pending") {
        return <div className="flex flex-1 flex-col items-center justify-center">
            <Loader className="animate animate-spin h-7 w-7 text-zinc-500 my-4" />
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading Messages...</p>
        </div>
    } else if (status === "error") {
        return <div className="flex flex-1 flex-col items-center justify-center">
            <ServerCrash className="animate animate-spin h-7 w-7 text-zinc-500 my-4" />
            <p className="text-sm text-zinc-500 dark:text-zinc-400">{error!.message}</p>
        </div> 
    }
  return (
    <div className="flex-1 flex flex-col py-4 overflow-y-auto" ref={chatRef}>
        {!hasNextPage && (<div className="flex-1" />)}
        {!hasNextPage && (<ChatWelcome type={type} name={name} />)}
        {hasNextPage && (
            <div className="flex justify-center">
                {isFetchingNextPage ? (
                    <Loader className="h-6 w-6 text-zinc-500 animate-spin my-4" />
                ) : (
                    <button onClick={(() => fetchNextPage())} className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 text-xs my-4 dark:hover:text-zinc-300 transition">Load Prevoise Messages</button>
                )}
            </div>
        )}
        <div className="flex flex-col-reverse mt-auto">
            {data?.pages?.map((group, i) => (
                <Fragment key={i}>
                    {group.items.map((message: MessageWithMemberWithProfile) => (
                         <ChatItem key={message.id} id={message.id} deleted={message.deleted} currentMember={member} fileUrl={message.fileUrl} member={message.member} timestamp={format(new Date(message.createdAt), DATE_FORMAT)} content={message.content} isUpdated={message.createdAt !== message.updatedAt} socketUrl={socketUrl} socketQuery={socketQuery} />
                    ))}
                </Fragment>
            ))}
        </div>
        <div ref={bottomRef} />
    </div>
  )
}
