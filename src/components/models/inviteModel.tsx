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
import { Check, Copy, RefreshCcw, RefreshCw } from "lucide-react"
import { useOrigin } from "@/hooks/useOrigin"


 export const InviteModel = () => {
    const router  = useRouter();
    const origin = useOrigin();
    const {isOpen, type, onClose, data, onOpen} = useModal();
    const {server} = data;
    const inviteUrl = `${origin}/invite/${server?.inviteCode}`
    const [copied, setCopied]= useState(false);
    const [isLoading, setIsLoading] = useState(false)

    const onCopy = async () => {
      await navigator.clipboard.writeText(inviteUrl)
      setCopied(true);

      setTimeout(() => {
        setCopied(false)
      }, 1000)
    }

    const onNew = async () => {
      try {
        setIsLoading(true);
        const response = await axios.patch(`/api/servers/${server?.id}/invite-code`);
        onOpen("invite", {server: response.data})
        setIsLoading(false);
      } catch (err) {
        console.log(err)
        setIsLoading(false)
      }
    }

    const isModelOpen = isOpen && type === "invite"

    const handleClose = () => {
        onClose();
    }

    return (
        <Dialog open={isModelOpen} onOpenChange={handleClose}>
           <DialogContent className="bg-white text-black p-0 overflow-hidden">
            <DialogHeader className="pt-8 px-6">
              <DialogTitle className="text-2xl m-2 text-center font-bold">Invite Peaple</DialogTitle>
            </DialogHeader>
              <div className="p-6">
                <Label className="uppercase text-xl font-bold text-zinc-500 dark:text-secondary/70 ">Server Invite Link: </Label>
                <div className="flex items-center mt-2 gap-x-2">
                    <Input disabled={isLoading} className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0" value={inviteUrl} />
                    <Button disabled={isLoading} variant={"primary"} onClick={onCopy} size={"icon"}>{copied ? <Check className="w-4 h-4" />  : <Copy className="w-4 h-4" />}</Button>
                </div>
                <Button onClick={onNew} disabled={isLoading} variant={"link"} size={"sm"} className="text-xs text-zinc-500 mt-4">Generate a new Link <RefreshCw className="h-4 w-4 ml-2" /></Button>
              </div>
           </DialogContent>
        </Dialog>
    )
 }