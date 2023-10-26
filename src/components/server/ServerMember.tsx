"use client"

import { cn } from "@/lib/utils"
import { Member, Profile, Server, membolRole } from "@prisma/client"
import { ShieldAlert, ShieldCheck } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import UserAvatar from "../ui/userAvatar"

const roleIconMap = {
  [membolRole.GUEST]: null,
  [membolRole.MODERATOR]: <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
  [membolRole.ADMIN]: <ShieldAlert className="h-4 w-4 ml-2 text-rose-500" />
}

export default function ServerMember({member, server}: {member: Member & {profile: Profile}, server: Server}) {
    const params = useParams();
    const router = useRouter();

    const icon = roleIconMap[member.role]
  return (
    <button className={cn("group px-2 py-2 rounded-md flex items-center w-full gap-x-2 hover:bg-zinc-200 dark:hover:bg-zinc-700/50 transition mb-1", params?.memberId === member.id && "bg-zinc-700/20 dark:bg-zinc-700")}>
        <UserAvatar src={member.profile.imgUrl} name={member.profile.name} classname="h-8 w-8 md:h-8 md:w-8" />
        <p className={cn("font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition", params?.memberId === member.id && "text-primary dark:text-zinc-200 dark:group-hover:text-white")}>{member.profile.name}</p>
       {icon}
    </button>
  )
}
