"use client"
import '@livekit/components-styles';
import { useEffect, useState } from "react"
import {ControlBar, GridLayout, LiveKitRoom, ParticipantTile, RoomAudioRenderer, VideoConference, useTracks} from '@livekit/components-react'
import { Channel } from "@prisma/client"
import { useUser } from "@clerk/nextjs"
import { Loader2 } from "lucide-react"
import { Track } from 'livekit-client';

export default function MediaRoom({chatId, video, audio}: {chatId: string, video: boolean, audio: boolean}) {
    const {user} = useUser();
    const [token, setToken] = useState("");

    useEffect(() => {
       if (!user?.firstName || !user?.lastName) return;

       const name = `${user?.firstName} ${user?.lastName}`;

       (async() => {
        try {
            const response = await fetch(`/api/livekit?room=${chatId}&username=${name}`)
            const data = await response.json();
            setToken(data.token);
        }
        catch(e) {
            console.log(e)
        }
       })()
    }, [user?.firstName, user?.lastName, chatId])

    if (token === "") {
        return (
            <div className="flex flex-col justify-center items-center flex-1">
                <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
                <p className="text-sm text-zinc-500 dark:text-zinc-400">loading...</p>
            </div>
        )
       }
  return (
    <LiveKitRoom serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL} token={token} connect={true} video={video} audio={audio} style={{ height: '100dvh' }}>
       {/* <MyVideoConference />
      <RoomAudioRenderer />
      <ControlBar /> */}
      <VideoConference />
    </LiveKitRoom>
  )
}
