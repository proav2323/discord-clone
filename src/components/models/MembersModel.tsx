"use client"
import { useForm } from "react-hook-form"
import { Dialog, DialogHeader,  DialogContent, DialogDescription, DialogTitle, DialogFooter } from "../ui/dialog"
import * as z from 'zod'
import {zodResolver} from '@hookform/resolvers/zod'
import { FormControl, Form, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { useEffect, useState } from "react"
import { FileUpload } from "../ui/fileUpload"
import axios from 'axios'
import { useRouter } from "next/navigation"
import { useModal } from "@/hooks/useModel.store"
import { Label } from "../ui/label"
import { Check, Copy, Gavel, Loader2, MoreVertical, RefreshCcw, RefreshCw, Shield, ShieldAlert, ShieldCheck, ShieldQuestion } from "lucide-react"
import { useOrigin } from "@/hooks/useOrigin"
import { ServerWithMembersWithProfiles } from "../../../types"
import { ScrollArea } from "../ui/scroll-area"
import UserAvatar from "../ui/userAvatar"
import {DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger} from '../ui/dropdown-menu'
import { membolRole } from "@prisma/client"
import qs from 'query-string'

const roleIconMap = {
  "GUEST": null,
  "MODERATOR": <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
  "ADMIN": <ShieldAlert className="h-4 w-4 ml-2 text-rose-500" />
}


 export const MembersModel = () => {
    const router  = useRouter();
    const {isOpen, type, onClose, data, onOpen} = useModal();
    const {server} = data as {server: ServerWithMembersWithProfiles};
    const [loadingId, setLoadingId] = useState("");

    const isModelOpen = isOpen && type === "members"

    const handleClose = () => {
        onClose();
    }

    const onRoleChange = async (role: membolRole, memberId: string) => {
      try {
        const url = qs.stringifyUrl({
          url: `/api/members/${memberId}`,
          query: {
            serverId: server.id,
          }
        })
        setLoadingId(memberId)
        const response = await axios.patch(url, {role})
        setLoadingId("")
        router.refresh();
        onOpen("members", {server: response.data})
      } catch (Err) {
        console.log(Err)
        setLoadingId("")
      }
    }

    const kickMember = async (memberId: string) => {
      try {
       setLoadingId(memberId);
        const url = qs.stringifyUrl({
          url: `/api/members/${memberId}`,
          query: {
            serverId: server.id,
          }
        })
        const response = await axios.delete(url)
        setLoadingId("")
        router.refresh();
        onOpen("members", {server: response.data})
      } catch (Err) {
        console.log(Err)
        setLoadingId("")
      }
    }

    return (
        <Dialog open={isModelOpen} onOpenChange={handleClose}>
           <DialogContent className="bg-white text-black overflow-hidden">
            <DialogHeader className="pt-8 px-6">
              <DialogTitle className="text-2xl m-2 text-center font-bold">Manage Members</DialogTitle>
              <DialogDescription className="text-center text-zinc-500">{server?.members?.length} Members</DialogDescription>
            </DialogHeader>
                  <ScrollArea className="mt-8 max-h-[420px] pr-6">
                         {server?.members?.map((member) => (
                          <div key={member.id} className="flex items-center gap-x-2 mb-6">
                            <UserAvatar src={member.profile.imgUrl} classname="" name={member.profile.name} />
                            <div className="flex flex-col gap-y-1">
                               <div className="text-xs font-semibold flex item-center gap-x-1">
                                {member.profile.name}
                                {roleIconMap[member.role]}
                               </div>
                               <p className="text-xs text-zinc-500">{member.profile.email}</p>
                            </div>
                            {server.profileId !== member.profileId && loadingId !== member.id && (
                              <div className="ml-auto">
                                <DropdownMenu>
                                  <DropdownMenuTrigger>
                                    <MoreVertical className="h-4 w-4 text-zinc-500" />
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent side={"left"}>
                                    <DropdownMenuSub>
                                      <DropdownMenuSubTrigger className="flex items-center">
                                             <ShieldQuestion className="h-4 w-4 mr-2" />
                                             <span>Role</span>
                                      </DropdownMenuSubTrigger>
                                      <DropdownMenuPortal>
                                       <DropdownMenuSubContent>
                                              <DropdownMenuItem onClick={() => onRoleChange("GUEST", member.id)}>
                                                <Shield className="h-4 w-4 mr-2" /> Guest {member.role === membolRole.GUEST && (
                                                <Check className="h-4 w-4 text-green-600 ml-auto" />
                                              )}</DropdownMenuItem>
                                              <DropdownMenuItem onClick={() => onRoleChange("MODERATOR", member.id)}>
                                                <ShieldCheck className="h-4 w-4 mr-2" /> Moderator {member.role === membolRole.MODERATOR && (
                                                <Check className="h-4 w-4 text-green-600 ml-auto" />
                                              )}</DropdownMenuItem>
                                       </DropdownMenuSubContent>
                                      </DropdownMenuPortal>
                                    </DropdownMenuSub>
                                    <DropdownMenuSeparator></DropdownMenuSeparator>
                                    <DropdownMenuItem onClick={() => kickMember(member.id)} className="flex items-center"><Gavel className="h-4 w-4 mr-2 text-rose-500" />Kick</DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            )}
                            {loadingId === member.id && (
                              <Loader2 className="animate-spin text-zinc-500 ml-auto w04 h-4" />
                            )}
                          </div>
                         ))}
                  </ScrollArea>
           </DialogContent>
        </Dialog>
    )
 }