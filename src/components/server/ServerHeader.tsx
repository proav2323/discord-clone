"use client"

import { membolRole } from "@prisma/client"
import { ServerWithMembersWithProfiles } from "../../../types"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,  } from "../ui/dropdown-menu";
import { ChevronDown, LogOut, PlusCircle, Settings, Trash, UserPlus, Users } from "lucide-react";
import { useModal } from "@/hooks/useModel.store";

export const ServerHeader = ({server, role}: {server: ServerWithMembersWithProfiles, role?: membolRole}) => {
    const {onOpen} = useModal();
    const isAdmin = role === membolRole.ADMIN;
    const isModerator = isAdmin || role === membolRole.MODERATOR

    return (
    <DropdownMenu>
        <DropdownMenuTrigger className="focus outline-none" asChild>
              <button className="w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition">{server.name} <ChevronDown className="h-5 w-5 ml-auto" /></button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]">
         {isModerator && (
            <DropdownMenuItem onClick={() => onOpen("invite", {server: server})} className="cursor-pointer text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm">
                Inivite Peaple <UserPlus className="h-4 w-4 ml-auto" />
            </DropdownMenuItem>
         )}
        {isAdmin && (
            <DropdownMenuItem onClick={() => onOpen("editServer", {server: server})} className="cursor-pointer px-3 py-2 text-sm">
                Server Settings <Settings className="h-4 w-4 ml-auto" />
            </DropdownMenuItem>
         )}
        {isAdmin && (
            <DropdownMenuItem onClick={() => onOpen("members", {server: server})} className="cursor-pointer px-3 py-2 text-sm">
                Manage Members <Users className="h-4 w-4 ml-auto" />
            </DropdownMenuItem>
         )}
        {isModerator && (
            <DropdownMenuItem className="cursor-pointer px-3 py-2 text-sm">
               Create channel <PlusCircle className="h-4 w-4 ml-auto" />
            </DropdownMenuItem>
         )}
         {isModerator && (
            <DropdownMenuSeparator />
         )}
        {isAdmin && (
            <DropdownMenuItem className="cursor-pointer px-3 py-2 text-sm text-rose-500">
               Delete Server <Trash className="h-4 w-4 ml-auto" />
            </DropdownMenuItem>
         )}
        {!isAdmin && (
            <DropdownMenuItem className="cursor-pointer px-3 py-2 text-sm text-rose-500">
               Leave Server <LogOut className="h-4 w-4 ml-auto" />
            </DropdownMenuItem>
         )}
        </DropdownMenuContent>
    </DropdownMenu>
    )
}