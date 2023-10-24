import { CurrentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db/utils"
import { channelType, membolRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { ServerHeader } from "./ServerHeader";
import { ServerSearch } from "./serverSearch";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";

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
    console.log(textChannels)
    
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
       </ScrollArea>
    </div>
  )
}
