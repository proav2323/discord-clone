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
import { redirect, useRouter } from "next/navigation"
import { useModal } from "@/hooks/useModel.store"

const formSchema = z.object({
    Name: z.string().min(1, {
        message: "Server is Required"
    }),
    imgUrl: z.string().min(1, {
        message: "Server Image is required"
    })
})

 export const EditServerModel = () => {
    const router  = useRouter();
    const {isOpen, type, onClose, data} = useModal();

    const isModelOpen = isOpen && type === "editServer"


    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            Name: "",
            imgUrl: ""
        },
    })

    useEffect(() => {
        if (data.server) {
            form.setValue("Name", data.server.name)
            form.setValue("imgUrl", data.server.imgUrl)
        }
    }, [form, data])

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (valus:  z.infer<typeof formSchema>) => {
        try {
           await axios.patch(`/api/servers/${data.server?.id}`, valus);
           form.reset();
           onClose();
           router.refresh();
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
              <DialogTitle className="text-2xl m-2 text-center font-bold">Edit a Server</DialogTitle>
              <DialogDescription className="text-md text-center text-zinc-500">Give Your Server a Personalit with name and image. you can always change it later</DialogDescription>
            </DialogHeader>
             <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="space-y-8 px-8">
                       <div className="flex items-center justify-center text-center">
                           <FormField name="imgUrl" control={form.control} render={({field}) => (
                        <FormItem>
                            <FormLabel className="m-2 uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">Server Image</FormLabel>
                            <FormControl>
                                <FileUpload endpoint="serverImage" value={field.value} onChange={field.onChange} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                           )} />
                       </div>

                       <FormField control={form.control} name={"Name"} render={({field}) => (
                        <FormItem>
                            <FormLabel className="m-2 uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">Server Name</FormLabel>
                            <FormControl>
                                <Input disabled={isLoading} className="bg-zinc-300/50 m-2 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0" placeholder="Enter Server Name" {...field} />
                            </FormControl>
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