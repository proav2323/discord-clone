"use client"
import { Member, Profile, membolRole } from '@prisma/client'
import React, { useEffect, useState } from 'react'
import UserAvatar from '../ui/userAvatar'
import { ActionTooltip } from '../ui/actionTooltip'
import { Edit, FileIcon, ShieldAlert, ShieldCheck, Trash } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import * as z from 'zod'
import axios from 'axios'
import qs from 'query-string'
import {useForm} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '../ui/button'

const rollIconMap = {
  [membolRole.GUEST]: null,
  [membolRole.MODERATOR]: <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
  [membolRole.ADMIN]: <ShieldAlert className="h-4 w-4 ml-2 text-rose-500" />
}

const formSchema = z.object({
  content: z.string().min(1)
})

export default function ChatItem({id, content, member, timestamp, fileUrl, deleted, currentMember, isUpdated, socketUrl, socketQuery}: {id: string, content: string, member: Member& {
    profile: Profile
}, timestamp: string, fileUrl: string | null, deleted: boolean, currentMember: Member, isUpdated: boolean, socketUrl: string, socketQuery: Record<string, string>}) {
  const fileType = fileUrl?.split(".").pop();
  const icon = rollIconMap[member.role]
  const isAdmin = membolRole.ADMIN === currentMember.role;
  const isMorador = membolRole.MODERATOR === currentMember.role;
  const isOwner = member.id === currentMember.id;
  const canDeleteMessage = !deleted && (isAdmin || isMorador || isOwner)
  const canEditMessage = !deleted && isOwner && !fileUrl
  const isPDF = fileType === "pdf" && fileUrl
  const isImage = !isPDF && fileUrl
  const [isEdit, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleteing] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {content: content},
  })

  useEffect(() => {
    form.reset({
      content: content
    })
  }, [content, form]);  

  useEffect(() => {
const handelKeyDown = (e: KeyboardEvent) => {
  if (e.key === "Escape" || e.keyCode === 27) {
setIsEditing(false)
  }
}

window.addEventListener("keydown", handelKeyDown)

return () => window.removeEventListener("keydown", handelKeyDown)
  }, [])

  const isLoading = form.formState.isSubmitting

  const onSumbit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({url: `${socketUrl}/${id}`, query: socketQuery})
      await axios.patch(url, values)
      form.reset();
      setIsEditing(false);
    } catch (e) {
      console.log(e)
      setIsEditing(false);
    }
  }

  return (
    <div className='relative group flex items-center hover:bg-black/5 transition p-4 w-full'>
      <div className='group flex gap-x-2 items-start w-full'>
         <div className='cursor-pointer hover:drop-shadow-md transition'>
            <UserAvatar src={member.profile.imgUrl} name={member.profile.name} />
         </div>
         <div className='flex flex-col w-full'>
            <div className='flex items-center gap-x-2'>
               <div className='flex items-center'>
                   <p className='font-semibold text-sm cursor-pointer hover:underline'>{member.profile.name}</p>
                   <ActionTooltip label={member.role}>
                         {icon}
                   </ActionTooltip>
               </div>
               <span className='text-sm text-zinc-500 dark:text-zinc-400'>{timestamp}</span>
            </div>
            {isImage && (
              <a href={fileUrl} target="_blank" rel="noopener noreferrer" className='relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48'>
                 <Image src={fileUrl} alt="" fill className='object-cover' />
              </a>
            )}
            {isPDF && (
      <div className="relative items-center p-2 mt-2 rounded-md flex bg-background/10">
      <FileIcon className="w-10 h-10 fill-indigo-200 stroke-indigo-400 " />
      <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline">
      pdf file
      </a>
    </div>
            )}
           {!fileUrl && !isEdit && (
            <p className={cn("text-sm text-zinc-600 dark:text-zinc-300", deleted && "italic text-zinc-500 dark:text-zinc-400 text-xs mt-1")}>{content}
            {isUpdated && !deleted && (
              <span className='text-[10px] text-zinc-500 dark:text-zinc-400 mx-2'>(edited)</span>
            )}
            </p>
           )}
           {!fileUrl && isEdit && ( 
            <Form {...form}>
               <form className='flex items-center w-full gap-x-2 pt-2' onSubmit={form.handleSubmit(onSumbit)}>
                <FormField control={form.control} name="content" render={({field}) => (
                  <FormItem className='flex-1'>
                     <FormControl>
                      <div className='relative w-full'>
                        <Input disabled={isLoading} className='p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offest-0 text-zinc-600 dark:text-zinc-200' placeholder='edited message' {...field} />
                      </div>
                     </FormControl>
                  </FormItem>
                )} />
                <Button type="submit" size={"sm"} disabled={isLoading} variant={"primary"}>Save</Button>
               </form>
               <span className='text-[10px] mt-1 text-zinc-400'>Press escape to cancel and enter to save</span>
            </Form>
           )}
         </div>
      </div>
      {canDeleteMessage && (
        <div className='hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm'>
          {canEditMessage && (
            <ActionTooltip label="edit">
             <Edit onClick={() => setIsEditing(true)} className='cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition' />
            </ActionTooltip>
          )}
          <ActionTooltip label="delete">
             <Trash className='cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition' />
            </ActionTooltip>
        </div>
      )}
    </div>
  )
}
