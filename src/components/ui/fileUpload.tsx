"use client"

import { UploadDropzone } from "@/lib/uploadthing"
import "@uploadthing/react/styles.css"
import { X } from "lucide-react"
import  Image from 'next/image'

interface fileUploadProps {
    onChange: (url?: string) => void,
    endpoint: "messageFile" | "serverImage",
    value: string
}
export const FileUpload = ({onChange, endpoint, value}: fileUploadProps) => {
  const fileType = value.split(".").pop();
  if (value && fileType !=="pdf") {
   return (
    <div className="relative h-20 w-20">
       <Image src={value} alt="" fill className="rounded-full" />
       <button className="absolute top-2 left-2 m-2 bg-rose-500 text-white p-1 rounded-full shadow-sm" type="button" onClick={() => onChange("")}><X className="h-4 w-4" /></button>
    </div>
   )
  }
    return (
    <UploadDropzone endpoint={endpoint} onClientUploadComplete={(res) => {
      onChange(res?.[0].url)
    }} onUploadError={(Err: Error) => {
         console.log(Err);
    }} />
    )
}