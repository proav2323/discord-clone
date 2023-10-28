import { Menu } from 'lucide-react'
import React from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from './ui/button'
import { Sidebar } from './navigation/Sidebar'
import { ServerSidebar } from './server/serverSidebar'


export default function MobileToggle({serverId}: {serverId: string}) {
  return (
    <Sheet>
        <SheetTrigger asChild>
            <Button variant={"ghost"} size={"icon"} className='md:hidden'><Menu /></Button>
        </SheetTrigger>
        <SheetContent side={"left"} className='p-0 flex gap-0'>
            <div className='w-[72px]'>
                <Sidebar />
            </div>
        <ServerSidebar id={serverId} />
        </SheetContent>
    </Sheet>
  )
}
