"use client"

import { UploadDropzone } from "@/lib/uploadthing"
import "@uploadthing/react/styles.css"
import { FileIcon, X } from "lucide-react"
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

  if (value && fileType === "pdf") {
    <div className="relative items-center p-2 mt-2 rounded-md flex bg-background/10">
      <FileIcon className="w-10 h-10 fill-indigo-200 stroke-indigo-400 " />
      <a href={value} target="_blank" rel="noopener noreferrer" className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline">
      {value}
      </a>
      <button className="absolute -top-2 -right-2 m-2 bg-rose-500 text-white p-1 rounded-full shadow-sm" type="button" onClick={() => onChange("")}><X className="h-4 w-4" /></button>
    </div>
  }
    return (
    <UploadDropzone endpoint={endpoint} onClientUploadComplete={(res) => {
      onChange(res?.[0].url)
    }} onUploadError={(Err: Error) => {
         console.log(Err);
    }} />
    )
}