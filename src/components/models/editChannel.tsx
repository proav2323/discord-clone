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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { channelType, membolRole } from "@prisma/client"
import qs from 'query-string'

const formSchema = z.object({
    Name: z.string().min(1, {
        message: "channel name is Required"
    }).refine(Name => Name !== "general", {
        message: "channel name cannot be general"
    }),
    Type: z.nativeEnum(channelType)
})

 export const EditChannelModel = () => {
    const router  = useRouter();
    const params = useParams();
    const {isOpen, type, onClose, data} = useModal();

    const isModelOpen = isOpen && type === "edit channel"
    const {ChannelType} = data;
    const {channel, server} = data

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            Name: "",
            Type: ChannelType !== undefined ? ChannelType : channelType.TEXT,
        },
    })

    useEffect(() => {
        if (ChannelType && channel) {
            form.setValue("Type", ChannelType);
            form.setValue("Name", channel.name)
        } else {
            form.setValue("Type", channelType.TEXT)
            form.setValue("Name", "")
        }
    }, [form, ChannelType, channel])

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (valus:  z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({
                  url: `/api/channels/${channel?.id}`, 
                  query: {
                    serverId: server?.id
                  }
            })
           await axios.post(url, valus);
           form.reset();
           router.refresh();
           onClose();
        } catch (err) {
            console.log(err)
        }
    }

    const handleClose = () => {
        form.reset();
        onClose();
    }

    return (
        <Dialog open={isModelOpen} onOpenChange={handleClose}>
           <DialogContent className="bg-white text-black p-0 overflow-hidden">
            <DialogHeader className="pt-8 px-6">
              <DialogTitle className="text-2xl m-2 text-center font-bold">Edit a Channel</DialogTitle>
            </DialogHeader>
             <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="space-y-8 px-8">
                       <FormField control={form.control} name={"Name"} render={({field}) => (
                        <FormItem>
                            <FormLabel className="m-2 uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">Channel Name</FormLabel>
                            <FormControl>
                                <Input disabled={isLoading} className="bg-zinc-300/50 m-2 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0" placeholder="Enter Channel Name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                       )} />
                       <FormField control={form.control} name="Type" render={({field}) => (
                          <FormItem>
                            <FormLabel>Channel Type</FormLabel>
                            <Select
                            disabled={isLoading}
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            >
                               <FormControl>
                                <SelectTrigger className="bg-zinc-300/50 border-0 text-black focus:ring-0 ring-offset-0 focus:ring-offset-0 outline-none capitalize">
                                    <SelectValue placeholder="Selete a Channel Type" />
                                </SelectTrigger>
                               </FormControl>
                               <SelectContent>
                                {Object.values(channelType).map((type) => (
                                 <SelectItem className="cap capitalize" key={type} value={type}>{type.toLowerCase()}</SelectItem>
                                ))}
                               </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                       )} />
                    </div>
                    <DialogFooter className="bg-gray-100 px-6 py-4">
                     <Button type="submit" variant={"primary"} disabled={isLoading}>Save</Button>
                    </DialogFooter>
                </form>
             </Form>
           </DialogContent>
        </Dialog>
    )
 }