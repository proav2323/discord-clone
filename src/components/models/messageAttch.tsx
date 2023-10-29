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
import qs from 'query-string'

const formSchema = z.object({
    imgUrl: z.string().min(1, {
        message: "attachment is required"
    })
})

 export const MessageAttch = () => {
    const {isOpen, onClose, type, data} = useModal();
    const {apiUrl, query} = data;
    const isModelOpen = isOpen && type === "message attach"
    const router  = useRouter();
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            imgUrl: ""
        },
    })

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (valus:  z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({url: apiUrl!, query})
           await axios.post(url, {
            content: valus.imgUrl,
            fileUrl: valus.imgUrl
           });
           handleClose();
        } catch (err) {
            console.log(err)
        }
    }
    const handleClose = () => {
      form.reset();
      onClose();
    }
    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
           <DialogContent className="bg-white text-black p-0 overflow-hidden">
            <DialogHeader className="pt-8 px-6">
              <DialogTitle className="text-2xl m-2 text-center font-bold">Add a file</DialogTitle>
              <DialogDescription className="text-md text-center text-zinc-500">send a file</DialogDescription>
            </DialogHeader>
             <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="space-y-8 px-8">
                       <div className="flex items-center justify-center text-center">
                           <FormField name="imgUrl" control={form.control} render={({field}) => (
                        <FormItem>
                            <FormLabel className="m-2 uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">attached Image</FormLabel>
                            <FormControl>
                                <FileUpload endpoint="messageFile" value={field.value} onChange={field.onChange} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                           )} />
                       </div>
                    </div>
                    <DialogFooter className="bg-gray-100 px-6 py-4">
                     <Button type="submit" variant={"primary"} disabled={isLoading}>send</Button>
                    </DialogFooter>
                </form>
             </Form>
           </DialogContent>
        </Dialog>
    )
 }