import { auth } from "@/lib/auth";
import { SearchParams } from "nuqs";
import { loadSearchParams } from "@/module/agents/params";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { AgentListHeader } from "@/module/agents/ui/components/list-header";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { AgentsView, AgentsViewError, AgentsViewLoading } from "@/module/agents/ui/views/agents-view";
import { getQueryClient, trpc } from "@/trpc/server";

interface Props{
  searchParams: Promise<SearchParams>;
}

const Page = async ({searchParams}: Props) => {
  const params = await loadSearchParams(searchParams);

    const session = await auth.api.getSession({
      headers: await headers(),
    });
  
    if(!session){
      redirect("/sign-in");
    }

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.agents.getMany.queryOptions({
    ...params
  }));
  return (
    <>
    <AgentListHeader/>
    <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<AgentsViewLoading/>}>
        <ErrorBoundary fallback={<AgentsViewError />}>
      <AgentsView />
        </ErrorBoundary>
        </Suspense>
    </HydrationBoundary>
    </>
  );
};

export default Page;
