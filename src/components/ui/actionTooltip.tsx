"use client"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"

interface actionTipProps {
    label: string,
    children: React.ReactNode,
    side?: "top" | "right" | "bottom" | "left"
    align? : "start" | "center" | "end"
}

export const ActionTooltip = ({label, children, side, align}: actionTipProps) => {
return (
    <TooltipProvider>
        <Tooltip delayDuration={50}>
            <TooltipTrigger asChild>{children}</TooltipTrigger>
            <TooltipContent side={side} align={align}>
                <p className="text-semibold">{label.toLowerCase()}</p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
)
}
