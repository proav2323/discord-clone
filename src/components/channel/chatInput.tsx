"use client"
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { Input } from '../ui/input'
import { Plus, Smile } from 'lucide-react'
import axios from 'axios'
import qs from 'query-string'
import { useModal } from '@/hooks/useModel.store'
import EmojiPicker from './EmojiPicker'
import { useRouter } from 'next/navigation'

const formSchema = z.object({
    content: z.string().min(1)
})

export default function ChatInput({apiUrl, name, query, type}: {apiUrl: string, query: Record<string , any>, name: string, type: "conversation" | "channel"}) {
    const {onOpen} = useModal();
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content: ''
        }
    })

    const isLoading = form.formState.isSubmitting;

    const onSumbit = async(value: z.infer<typeof formSchema>) => {
      try {
        const url = qs.stringifyUrl({url: apiUrl, query})
        await axios.post(url, value)
        form.reset();
        router.refresh();
      } catch (E) {
        console.log(E)
      }
    }

    const onEmojiSelect = (val: string, field: any) => {
      field.onChange(`${field.value} ${val}`)
    }
  return (
    <Form {...form}>
       <form onSubmit={form.handleSubmit(onSumbit)}>
          <FormField control={form.control} name="content" render={({field}) => {
            return (
                <FormItem>
                    <FormControl>
                        <div className='relative p-4 pb-6'>
                            <button type='button' onClick={() => onOpen("message attach", {apiUrl: apiUrl, query: query})} className='absolute top-7 left-8 h-[24px] w-[24px] bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 transition rounded-md flex items-center justify-center'>
                                <Plus className='text-white dark:text-[#313338]' />
                            </button>
                            <Input placeholder={`Message ${type === "conversation" ? name : "#" +  name}`} disabled={isLoading} className='px-14 py-6 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200' {...field} />
                            <div className='absolute top-7 right-8'>
                                <EmojiPicker onChange={(e: string) => onEmojiSelect(e, field)} />
                            </div>
                        </div>
                    </FormControl>
                </FormItem>
            )
          }} />
       </form>
    </Form>
  )
}
