"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { ErrorState } from "@/components/error-state";
import { EmptyState } from "@/components/empty-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { columns } from "../components/columns";
import { DataTable } from "@/components/data-table";
import { DataPagination } from "../components/data-pagination";
import { useAgentsFilters } from "../../hooks/agents-filters";
import { useRouter } from "next/navigation";

export const AgentsView = () => {
    const router = useRouter();
    const [filters, setFilters] = useAgentsFilters();
    const trpc = useTRPC();
    const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions({...filters}));

    return (
        <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
            <DataTable data={data.items} columns={columns} onRowClick={(row) => router.push(`/agents/${row.id}`)}/>
            <DataPagination
            page={filters.page}
            totalPages={data.totalPages}
            onPageChange={(page) => setFilters({ page })}
            />
            {data.items.length === 0 && (
                <EmptyState title="No Agents Found" description="Your AI interviewer starts here. Create your AI Agent to begin engaging candidates intelligently." />
            ) }
        </div>
    )
}

export const AgentsViewLoading = () => {
    return (
        <LoadingState title="Loading Agents" description="Please wait while we load the agents." />
    )
}

export const AgentsViewError = () => {
    return (
        <ErrorState title="Error Loading Agents" description="There was an issue loading the agents. Please try again later." />
    )
}