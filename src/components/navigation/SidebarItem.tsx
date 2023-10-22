"use client"

import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ActionTooltip } from '../ui/actionTooltip'

interface sidebarItemProps {
    name: string,
    id: string,
    imgUrl: string,
}

export const SidebarItem = ({name, id, imgUrl}: sidebarItemProps) => {
    const params = useParams();
    const router = useRouter();

    const onClick = () => {
      router.push(`/servers/${id}`)
    }


 return (
    <ActionTooltip side='right' align='center' label={name}>
       <button className="group flex items-center" onClick={onClick}>
        <div className={cn("absolute bg-primary left-0 rounded-r-full transition-all w-[4px]", params?.serverId !== id && "group-hover:h-[20px]", params?.serverId === id ? "h-[36px]" : "h-[8px]")} />
        <div className={cn("relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all ease-in-out overflow-hiddem", params?.serverId === id && "bg-primary/10 text-primary rounded-[16px]")}>
            <Image fill src={imgUrl} alt="" className={cn("rounded-[24px] group-hover:rounded-[16px]", params?.serverId === id && "rounded-[16px]")} />
        </div>
       </button>
    </ActionTooltip>
 )
}