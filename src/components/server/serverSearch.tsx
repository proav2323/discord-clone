"use client"

import { Search, SearchIcon } from "lucide-react"
import { useEffect, useState } from "react"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { useRouter } from "next/navigation"
import { useParams } from "next/navigation"
import { channelType } from "@prisma/client"


interface serverSearchProps {
data: {label: string, type: "channel" | "member", data: {icon: React.ReactNode, name: string, id: string}[] | undefined}[]
}
export const ServerSearch = ({data}: serverSearchProps) => {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const params = useParams();

    useEffect(() => {
        const keyDown = (e: KeyboardEvent) => {
              if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                   e.preventDefault();
                   setOpen(true);    
              } 
        } 

        document.addEventListener("keydown", keyDown);
        return () => document.removeEventListener("keydown", keyDown);
    }, [])

    const onClick = (id: string, type: "channel" | "member") => {
        setOpen(false);
          if (type === "member") {
            return router.push(`/servers/${params?.serverId}/conversations/${id}`)
          }

          if (type === "channel") {
            return router.push(`/servers/${params?.serverId}/channels/${id}`)
          }
    }


return (
 <>
 <button onClick={() => setOpen(true)} className="group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition">
 <Search className="w-4 h-4 text-zinc-500 dark:text-zibnnc-400" />
 <p className="font-semibold text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition">
    Search
 </p>
 <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
   <span className="text-xs">CTLR</span>K
 </kbd>
 </button>
 <CommandDialog open={open} onOpenChange={setOpen}>
   <CommandInput placeholder="Serach all Channels and memebrs" />
   <CommandList>
    <CommandEmpty>
        No Results Found
    </CommandEmpty>
    {data.map((dat) => {
        if (!data?.length) {
                return null;
        }
    return (
        <CommandGroup key={dat.label} heading={dat.label}>
                   {dat.data?.map((da) => {
                    return (
                        <CommandItem onSelect={() => onClick(da.id, dat.type)} key={da.id}>
                            {da.icon}
                            <span>{da.name}</span>
                        </CommandItem>
                    )
                   })}
        </CommandGroup>
            )
    })}
   </CommandList>
 </CommandDialog>
 </>
)
}