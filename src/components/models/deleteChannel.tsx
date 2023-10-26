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
import { useParams, useRouter } from "next/navigation"
import { useModal } from "@/hooks/useModel.store"
import { Label } from "../ui/label"
import { Check, Copy, RefreshCcw, RefreshCw } from "lucide-react"
import { useOrigin } from "@/hooks/useOrigin"
import qs from 'query-string'


 export const DeleteChannelModel = () => {
    const router  = useRouter();
    const {isOpen, type, onClose, data, onOpen} = useModal();
    const {server, channel} = data;
    const [isLoading, setIsLoading] = useState(false);

    const isModelOpen = isOpen && type === "delete channel"

    const handleClose = () => {
        onClose();
    }

    const onAccept = async () => {
      try {
        setIsLoading(true)
        const url = qs.stringifyUrl({url:`/api/channels/${channel?.id}`, query: {
          serverId: server?.id
        }}) 
        await axios.delete(url);
        setIsLoading(false)
        onClose();
        router.refresh();
        router.push(`/servers/${server?.id}}`)
      } catch (Err) {
        console.log(Err)
        setIsLoading(false)
      }
    }

    return (
        <Dialog open={isModelOpen} onOpenChange={handleClose}>
           <DialogContent className="bg-rose-500 text-white p-0 overflow-hidden">
            <DialogHeader className="pt-8 px-6">
              <DialogTitle className="text-2xl m-2 text-center font-bold">Delete channel</DialogTitle>
              <DialogDescription className="text-center text-white-500" >Are You Sure You Want To Delete <span className="font-semibold text-gray-500">{channel?.name}</span> Channel</DialogDescription>
            </DialogHeader>
              <DialogFooter className="bg-red-500 py-4 px-4">
                    <div className="flex items-center justify-between w-full">
                      <Button disabled={isLoading} onClick={handleClose} variant={"ghost"}>Cancel</Button>
                      <Button disabled={isLoading} onClick={onAccept} variant={"primary"}>Confirm</Button>
                    </div>
              </DialogFooter>
           </DialogContent>
        </Dialog>
    )
    }