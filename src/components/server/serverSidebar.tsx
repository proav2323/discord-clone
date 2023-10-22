import { CurrentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db/utils"
import { channelType } from "@prisma/client";
import { redirect } from "next/navigation";
import { ServerHeader } from "./ServerHeader";

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

    const textChannels = server.channels.filter((data) => data.type = channelType.TEXT)
    const videoChannels = server.channels.filter((data) => data.type = channelType.VIDEO)
    const audioChannels = server.channels.filter((data) => data.type = channelType.AUDIO)
    const members = server.members.filter((data) => data.profileId !== profile.id)
    const role = server.members.find((data) => data.profileId === profile.id)?.role;

    
  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2b2d31] bg-[#f2f3f5]">
       <ServerHeader server={server} role={role} />
    </div>
  )
}
