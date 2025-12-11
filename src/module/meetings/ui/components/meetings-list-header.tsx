"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PlusIcon, XCircleIcon } from "lucide-react"
import { MeetingDialogue } from "./meetings-dialogue"

export const MeetingsListHeader = () =>{
    const [isDialogue, setIsDialogue] = useState(false);
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
                    Create New Meeting
                </Button>
            </div>

            {/* Search filter */}
            <div className="flex items-center gap-x-2 p-1">
                
            </div>
        </div>
        </>
    )
}