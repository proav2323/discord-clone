import MediaRoom from "@/components/MediaRoom";
import ChatHeader from "@/components/channel/ChatHeader";
import ChatInput from "@/components/channel/chatInput";
import ChatMessages from "@/components/channel/chatMessages";
import { CurrentProfile } from "@/lib/currentProfile"
import { db } from "@/lib/db/utils";
import { redirectToSignIn } from "@clerk/nextjs";
import { channelType } from "@prisma/client";
import { redirect } from "next/navigation";

export default async function channelIdPage({params} : {params: {serverId: string, channelId: string}}) {

  const profile = await CurrentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const channel = await db.channel.findUnique({
    where: {
      id: params.channelId,
    },
  })

  const member = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id
    }
  });

  if (!channel || !member) {
    return redirect("/");
  }

  return (
   <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
     <ChatHeader serverId={channel.serverId} name={channel.name} type="channel" />
     {channel.type === channelType.TEXT && (
      <>
            <ChatMessages member={member} name={channel.name} type="channel" apiUrl="/api/messages" socketUrl="/api/socket/messages" socketQuery={{
        channelId: channel.id,
        serverId: channel.serverId,
      }} paramsKey="channelId" paramValue={channel.id} chatId={channel.id} />
     <ChatInput apiUrl={"/api/socket/messages"} type="channel" name={channel.name} query={{
      channelId: channel.id,
      serverId: channel.serverId
     }} />
      </>
     )}
     {channel.type ===  channelType.AUDIO && (
      <MediaRoom chatId={channel.id} video={false} audio={true} />
     )}
      {channel.type ===  channelType.VIDEO && (
      <MediaRoom chatId={channel.id} video={true} audio={true} />
     )}
   </div>
  )
}
