"use client"

import { channelType, membolRole } from "@prisma/client"
import { ServerWithMembersWithProfiles } from "../../../types"
import { ActionTooltip } from "../ui/actionTooltip"
import { Plus, Settings } from "lucide-react"
import { useModal } from "@/hooks/useModel.store"

export default function ServerSection({label, role, server, channelType, sectionType}: {label: string, role?: membolRole, sectionType: "channels" | "memebrs", channelType?: channelType, server?: ServerWithMembersWithProfiles}) {
    const {onOpen} = useModal();
  return (
    <div className="flex items-center justify-between my-2">
        <p className="text-xs uppercase text-zinc-500 dar:text-zinc-400 font-semibold">
            {label}
        </p>
        {role !== membolRole.GUEST && sectionType === "channels" && (
            <ActionTooltip label="Craete Channel" side="top">
               <button onClick={() => onOpen("createChannel", {ChannelType: channelType})} className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-600 dark:hover:text-zinc-300 transition"><Plus className="h-4 w-4 mr-2" /></button>
            </ActionTooltip> 
        )}
        {role === membolRole.ADMIN && sectionType === "memebrs" && (
            <ActionTooltip label="Manage Members" side="top">
               <button onClick={() => onOpen("members", {server: server})} className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-600 dark:hover:text-zinc-300 transition"><Settings className="h-4 w-4 mr-2" /></button>
            </ActionTooltip>   
        )}
    </div>
  )
}
