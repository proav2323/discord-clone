import ChatHeader from "@/components/channel/ChatHeader";
import { FindOrCreateConversation } from "@/lib/conversations";
import { CurrentProfile } from "@/lib/currentProfile"
import { db } from "@/lib/db/utils";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function page({params}: {params:  {serverId: string, memberId: string}}) {
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
    </div>
  )
}
