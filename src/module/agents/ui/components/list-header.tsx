"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import { AgentDialogue } from "./agent-dialogue"

export const AgentListHeader = () =>{
    const [isDialogueOpen, setIsDialogueOpen] = useState(false);
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
        </div>
        </>
    )
}