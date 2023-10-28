import { Channel } from "@prisma/client"
import { Hash, Menu } from "lucide-react"
import MobileToggle from "../mobileToggle"
import UserAvatar from "../ui/userAvatar"

export default function ChatHeader({serverId, name, type, imgUrl}: {serverId: string, name: string, type: "conversations" | "channel", imgUrl?: string}) {
  return (
    <div className="text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2">
        <MobileToggle serverId={serverId} />
        {type === "channel" && (
            <Hash className="w-5 h-5 mr-2 text-zinc-500 dark:text-zinc-400" />
        )}
        {type === "conversations" && (
          <UserAvatar src={imgUrl} classname="h-8 w-8 md:h-8 md:w-8 mr-2" name={name} />
        )}
        <p className="font-semibold text-md text-black dark:text-white">{name}</p>
    </div>
  )
}
