import { CurrentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db/utils"
import { channelType, membolRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { ServerHeader } from "./ServerHeader";
import { ServerSearch } from "./serverSearch";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import ServerSection from "./serverSection";
import ServerChannel from "./ServerChannel";
import ServerMember from "./ServerMember";

const inonMap = {
  [channelType.TEXT]: <Hash className="h-4 w-4 mr-2" />,
  [channelType.AUDIO]: <Mic className="h-4 w-4 mr-2" />,
  [channelType.VIDEO]: <Video className="h-4 w-4 mr-2" />
}

const rollIconMap = {
  [membolRole.GUEST]: null,
  [membolRole.MODERATOR]: <ShieldCheck className="h-4 w-4 mr-2 text-indigo-500" />,
  [membolRole.ADMIN]: <ShieldAlert className="h-4 w-4 mr-2 text-rose-500" />
}



export const ServerSidebar = async ({id}: {id: string}) => {
    const profile = await CurrentProfile();
    if (!profile) {
        return redirect("/");
    }
    const server = await db.server.findUnique({
    where: {
      id: id,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: "asc",
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: "asc",
        }
      }
    }
  })

    if (!server) {
        return redirect("/")
    }


    const textChannels = server.channels.filter((data) => data.type === channelType.TEXT)
    const videoChannels = server.channels.filter((data) => data.type === channelType.VIDEO)
    const audioChannels = server.channels.filter((data) => data.type === channelType.AUDIO)
    const members = server.members.filter((data) => data.profileId !== profile.id)
    const role = server.members.find((data) => data.profileId === profile.id)?.role;
    
  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2b2d31] bg-[#f2f3f5]">
       <ServerHeader server={server} role={role} />
       <ScrollArea className="flex-1 px-3">
             <div className="mt-2">
              <ServerSearch data={
                 [
                  {
                    label: "Text Channels",
                    type: "channel",
                    data: textChannels?.map((chan) => ({id: chan.id, icon: inonMap[chan.type], name: chan.name}))
                 },
                {
                    label: "Voice Channels",
                    type: "channel",
                    data: audioChannels?.map((chan) => ({id: chan.id, icon: inonMap[chan.type], name: chan.name}))
                 },
                {
                    label: "Video Channels",
                    type: "channel",
                    data: videoChannels?.map((chan) => ({id: chan.id, icon: inonMap[chan.type], name: chan.name}))
                 },
                {
                    label: "Members",
                    type: "member",
                    data: members?.map((chan) => ({id: chan.id, icon: rollIconMap[chan.role], name: chan.profile.name}))
                 }
                ]
              } />
             </div>
             <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />
             <div className="space-y-2">{!!textChannels?.length && (
              <div className="mb-2">
                <ServerSection label="Text Channels" sectionType="channels" channelType={channelType.TEXT} role={role} />
                {textChannels.map((channel) => (
                  <ServerChannel key={channel.id} channel={channel} server={server} role={role} />
                ))}
              </div>
             )}</div>
            <div className="space-y-2">{!!audioChannels?.length && (
              <div className="mb-2">
                <ServerSection label="Voice Channels" sectionType="channels" channelType={channelType.AUDIO} role={role} />
                {audioChannels.map((channel) => (
                  <ServerChannel key={channel.id} channel={channel} server={server} role={role} />
                ))}
              </div>
             )}</div>
            <div className="space-y-2">{!!videoChannels?.length && (
              <div className="mb-2">
                <ServerSection label="Video Channels" sectionType="channels" channelType={channelType.VIDEO} role={role} />
                {videoChannels.map((channel) => (
                  <ServerChannel key={channel.id} channel={channel} server={server} role={role} />
                ))}
              </div>
             )}</div>
           <div className="space-y-2">{!!members?.length && (
              <div className="mb-2">
                <ServerSection label="Members" sectionType="memebrs" role={role} server={server} />
                {members.map((channel) => (
                  <ServerMember key={channel.id} member={channel} server={server} />
                ))}
              </div>
             )}</div>
       </ScrollArea>
    </div>
  )
}
