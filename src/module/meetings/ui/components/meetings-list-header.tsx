"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PlusIcon, XCircleIcon } from "lucide-react"
import { MeetingDialogue } from "./meetings-dialogue"
import { MeetingsSearchFilter } from "./meeting-search-filter"
import { StatusFilter } from "./status-filters"
import { AgentIdFilter } from "./agents-id-filter"
import { useMeetingsFilters } from "../../hooks/meetings-filters"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

export const MeetingsListHeader = () =>{
    const [filters, setFilters] = useMeetingsFilters();
    const [isDialogue, setIsDialogue] = useState(false);

    const isFilterModified = !!filters.status || !!filters.search || !!filters.agentId;

    const onClearFilter = () => {
        setFilters({
            status:null,
            agentId:"",
            search:"",
            page:1,
        })
    }
    return(
        <>
        <MeetingDialogue open={isDialogue} onOpenChange={setIsDialogue}/>
        <div className="py-4 px-4 md:px-8 flex flex-col gay-y-4">
            <div className="flex items-center justify-between">
                <h5 className="text-xl font-semibold">
                    My Meetings 
                </h5>
                <Button onClick={() => setIsDialogue(true)}>
                    <PlusIcon/>
                        New Meeting
                </Button>
            </div>

            {/* Search filter */}
            <ScrollArea>
            <div className="flex items-center gap-x-2 p-1">
                <MeetingsSearchFilter />
                <StatusFilter />
                <AgentIdFilter />
                {isFilterModified && (
                    <Button variant="outline" onClick={onClearFilter}>
                        <XCircleIcon className="size-4"/>
                        Clear
                    </Button>
                )}
            </div>
            <ScrollBar orientation="horizontal"/>
            </ScrollArea>
        </div>
        </>
    )
}