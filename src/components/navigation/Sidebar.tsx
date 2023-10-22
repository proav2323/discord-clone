import { CurrentProfile } from "@/lib/currentProfile"
import { db } from "@/lib/db/utils";
import { redirect } from "next/navigation";
import { SidebarAction } from "./SidebarAction";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { SidebarItem } from "./SidebarItem";
import { ThemeToggle } from "../ui/ThemeToggle";
import { UserButton } from "@clerk/nextjs";


export const Sidebar = async () => {
    const profile = await CurrentProfile();

    if (!profile) {
        return redirect("/")
    }

    const servers = await db.server.findMany({where: {
        members: {
            some: {profileId: profile.id}
        }
    }})
    return (
        <div className="space-y-4 flex flex-col items-center h-full text-primary w-full dark:bg-[#1e1f22] py-3">
            <SidebarAction />
            <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto" />
            <ScrollArea className="flex-1 w-full">
               {servers.map((server) => (
                <div className="mb-4" key={server.id}>
                <SidebarItem name={server.name} imgUrl={server.imgUrl} id={server.id} />
                </div>
               ))}
            </ScrollArea>
            <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
               <ThemeToggle />
               <UserButton afterSignOutUrl="/" appearance={{
                elements: {
                   avatarBox: "h-[48px] w-[48px]"
                }
               }} />
            </div>
        </div>
    )
}