"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PlusIcon, XCircleIcon } from "lucide-react"
import { AgentDialogue } from "./agent-dialogue"
import { useAgentsFilters } from "../../hooks/agents-filters"
import { AgentSearchFilter } from "./agent-search-filter"
import { AGENT_PAGE } from "@/constants"

export const AgentListHeader = () =>{
    const [filters, setFilters] = useAgentsFilters();
    const [isDialogueOpen, setIsDialogueOpen] = useState(false);

    const ismodifyFilters = !!filters.search;

    const onClearFilters = () =>{
        setFilters({ search: "", page: AGENT_PAGE});
    }
    return(
        <>
        <AgentDialogue open={isDialogueOpen} onOpenChange={setIsDialogueOpen} />
        <div className="py-4 px-4 md:px-8 flex flex-col gay-y-4">
            <div className="flex items-center justify-between">
                <h5 className="text-xl font-semibold">
                    Agents List  
                </h5>
                <Button size="sm" onClick={() => setIsDialogueOpen(true)}>
                    <PlusIcon/>
                    Create New Agent
                </Button>
            </div>

            {/* Search filter */}
            <div className="flex items-center gap-x-2 p-1">
                <AgentSearchFilter/>
                {ismodifyFilters && (
                    <Button variant="outline" size="sm" onClick={onClearFilters}>
                        <XCircleIcon/> Clear
                    </Button>
                )}
            </div>
        </div>
        </>
    )
}