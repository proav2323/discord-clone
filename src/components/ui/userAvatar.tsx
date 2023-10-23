import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

export default function UserAvatar({src, classname, name}: {src?: string, classname?: string, name: string}) {
return (
<Avatar className={cn("h-7 w-7 md:h-10 md:w-10", classname)}>
  <AvatarImage src={src} />
  <AvatarFallback>{name}</AvatarFallback>
</Avatar>
)
}