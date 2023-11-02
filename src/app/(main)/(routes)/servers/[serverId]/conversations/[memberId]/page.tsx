import MediaRoom from "@/components/MediaRoom";
import ChatHeader from "@/components/channel/ChatHeader";
import ChatInput from "@/components/channel/chatInput";
import ChatMessages from "@/components/channel/chatMessages";
import { FindOrCreateConversation } from "@/lib/conversations";
import { CurrentProfile } from "@/lib/currentProfile"
import { db } from "@/lib/db/utils";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function page({params, searchParams}: {params:  {serverId: string, memberId: string,}, searchParams: {
  video?: boolean
}}) {
  const profile = await CurrentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const currentMember = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id
    },
    include: {
      profile: true
    }
  })

  if (!currentMember) {
    return redirect("/");
  }

  const conversation = await FindOrCreateConversation(currentMember.id, params.memberId);

  if (!conversation) {
    return redirect(`/servers/${params.serverId}`)
  }

  const {memberOne, memberTwo} = conversation;

  const otherMember = memberOne.profileId === profile.id ? memberTwo : memberOne

  return (
    <div className="bg-white dark:bg-[#313338] h-full flex flex-col">
      <ChatHeader imgUrl={otherMember.profile.imgUrl} name={otherMember.profile.name} type="conversations" serverId={params.serverId} />
      {!searchParams.video && (
        <>
              <ChatMessages name={otherMember.profile.name} member={currentMember} chatId={conversation.id} type="conversation" apiUrl="/api/direct-messages" socketUrl="/api/socket/direct-messages" paramsKey="conversationId" paramValue={conversation.id} socketQuery={{
        conversationId: conversation.id
      }} />
      <ChatInput apiUrl="/api/socket/direct-messages" type="conversation" name={otherMember.profile.name} query={{
        conversationId: conversation.id
      }} />
        </>
      )}
      {searchParams.video && (
        <MediaRoom audio={true} video={true} chatId={conversation.id} />
      )}
    </div>
  )
}
