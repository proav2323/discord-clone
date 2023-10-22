"use client"
import { Plus } from "lucide-react"
import { ActionTooltip } from "../ui/actionTooltip"
import { useModal } from "@/hooks/useModel.store"

export const SidebarAction = () => {
    const {onOpen} = useModal();
return (
    <div>
        <ActionTooltip label="add a server" align="center" side="right" >
       <button className="group flex items-center" onClick={() => onOpen("createServer")}>
        <div className="flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all ease-in-out overflow-hidden items-center duration-300 justify-center bg-background dark:bg-neutral-700 group-hover:bg-emerald-500">
            <Plus className="group-hover:text-white transition-all text-emerald-500" size={25} />
        </div>
       </button>
       </ActionTooltip>
    </div>
)
}