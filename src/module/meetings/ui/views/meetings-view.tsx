"use client";

import { useRouter } from "next/navigation";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { DataTable } from "@/components/data-table";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { columns } from "../components/columns";
import { EmptyState } from "@/components/empty-state";
import { useMeetingsFilters } from "../../hooks/meetings-filters";
import { DataPagination } from "@/components/data-pagination";

export const MeetingsView = () => {
  const trpc = useTRPC();
  const router = useRouter();
  const [filters, setFilters] = useMeetingsFilters();
  const { data } = useQuery(trpc.meetings.getMany.queryOptions({
    ...filters,
  }));
  return (
    <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
      <DataTable 
      data={data?.items ?? []} 
      columns={columns} 
      onRowClick={(row) => router.push(`/meetings/${row.id}`)}/>
      <DataPagination 
      page={filters.page}
      totalPages={data?.totalPages ?? 1}
      onPageChange={(page) => setFilters({page})}
      />
      {data && data.items.length === 0 && (
        <EmptyState
          title="No Meetings Found"
          description="Schedule a meeting here to connect with others. Each meeting lets you collaborate and interact with participants in real-time"
        />
      )}
    </div>
  );
};

export const MeetingsViewLoading = () => {
  return (
    <LoadingState
      title="Loading Agents"
      description="Please wait while we load the agents."
    />
  );
};

export const MeetingsViewError = () => {
  return (
    <ErrorState
      title="Error Loading Agents"
      description="There was an issue loading the agents. Please try again later."
    />
  );
};
