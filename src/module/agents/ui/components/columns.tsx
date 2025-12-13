"use client"

import { ColumnDef } from "@tanstack/react-table"
import { AgentMany } from "../../types"
import { GeneratedAvatar } from "@/components/generated-avatar"
import { CornerDownRightIcon, VideoIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export const columns: ColumnDef<AgentMany[number]>[] = [
  {
    accessorKey: "name",
    header: "Agent Name",
    cell: ({ row }) => (
        <div className="flex flex-col gap-y-1">
            <div className="flex items-center gap-x-2">
                <GeneratedAvatar 
                variant="botttsNeutral"
                seed={row.original.name}
                className="w-6 h-6 rounded-full"
                />

                <span className="font-semibold capitalize">{row.original.name}</span>
            </div>

                <div className="flex items-center gap-x-2">
                    <CornerDownRightIcon className="w-3 h-3 text-muted-foreground"/>
                    <span className="text-sm text-muted-foreground max-w-[200px] truncate">{row.original.instructions}</span>
                </div>
            </div>
    )
  },

  {
    accessorKey: "meetingCount",
    header: "Meetings",
    cell: ({ row }) => (
       <Badge variant="outline" className="flex items-center gap-x-2 [&>svg]:size-4">
        <VideoIcon className="w-4 h-4"/>
        {row.original.meetingCount} {row.original.meetingCount === 1 ? "Meeting" : "Meetings"}
       </Badge>
    )
  }
 
]