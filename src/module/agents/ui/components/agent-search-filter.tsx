import {SearchIcon} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAgentsFilters } from "../../hooks/agents-filters";

export const AgentSearchFilter = () =>{
    const [filters, setFilters] = useAgentsFilters();
    return(
        <div className="relative">
            <Input
                className="h-9 bg-white w-[200px] pl-7" 
                value={filters.search}
                onChange={(e) => setFilters({ search: e.target.value })}
                placeholder="Search agents..."
            />
            <SearchIcon className="w-4 h-4 absolute top-1/2 -translate-y-1/2 left-2 text-muted-foreground"/>
        </div>
    )
}