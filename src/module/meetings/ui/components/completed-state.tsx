import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MeetingsOne } from "../../types";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  BookOpenTextIcon,
  ClockFadingIcon,
  FileTextIcon,
  FileVideoIcon,
  SparklesIcon,
} from "lucide-react";
import Link from "next/link";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { formatDuration } from "@/lib/utils";
import MarkDown from "react-markdown";
import { Transcript } from "./transcript";
import { ChatProvider } from "./chat-provider";

interface Props {
  data: MeetingsOne;
}

export const CompletedState = ({ data }: Props) => {
  return (
    <div className="flex flex-col gap-y-3 max-w-4xl mx-auto w-full pb-8">
      <Tabs defaultValue="summary" className="w-full">
        {/* Navigation Tabs Header */}
        <div className="bg-white rounded-lg border shadow-xs px-3">
          <ScrollArea>
            <TabsList className="p-0 bg-transparent justify-start rounded-none h-10 gap-x-4">
              <TabsTrigger
                value="summary"
                className="text-xs text-muted-foreground bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary h-full rounded-none px-2 flex items-center gap-1.5 font-medium cursor-pointer"
              >
                <BookOpenTextIcon className="size-3.5" />
                Summary
              </TabsTrigger>
              <TabsTrigger
                value="transcript"
                className="text-xs text-muted-foreground bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary h-full rounded-none px-2 flex items-center gap-1.5 font-medium cursor-pointer"
              >
                <FileTextIcon className="size-3.5" />
                Transcript
              </TabsTrigger>
              <TabsTrigger
                value="recording"
                className="text-xs text-muted-foreground bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary h-full rounded-none px-2 flex items-center gap-1.5 font-medium cursor-pointer"
              >
                <FileVideoIcon className="size-3.5" />
                Recording
              </TabsTrigger>
              <TabsTrigger
                value="chat"
                className="text-xs text-muted-foreground bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary h-full rounded-none px-2 flex items-center gap-1.5 font-medium cursor-pointer"
              >
                <SparklesIcon className="size-3.5" />
                Ask AI
              </TabsTrigger>
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>

        {/* Tab 1: Summary Content */}
        <TabsContent value="summary" className="mt-3">
          <div className="bg-white rounded-lg border shadow-xs p-5 flex flex-col gap-y-4">
            {/* Header / Meta Info */}
            <div className="flex flex-col gap-y-1.5 border-b pb-3">
              <h2 className="text-lg font-semibold capitalize text-neutral-900 tracking-tight">
                {data.name}
              </h2>
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <Link
                  href={`/agents/${data.agent.id}`}
                  className="flex items-center gap-x-1.5 font-medium text-neutral-800 hover:underline"
                >
                  <GeneratedAvatar
                    variant="botttsNeutral"
                    seed={data.agent.name}
                    className="size-4"
                  />
                  {data.agent.name}
                </Link>
                <span>•</span>
                <span>{data.startedAt ? format(data.startedAt, "PPP") : "Recent"}</span>
                <span>•</span>
                <Badge
                  variant="outline"
                  className="flex items-center gap-x-1 py-0 px-2 text-[11px] font-normal"
                >
                  <ClockFadingIcon className="size-3 text-blue-600" />
                  {data.duration ? formatDuration(data.duration) : "0s"}
                </Badge>
              </div>
            </div>

            {/* Markdown Summary Body */}
            <div className="prose prose-sm max-w-none text-neutral-800 text-[13px] leading-relaxed">
              <MarkDown
                components={{
                  h1: ({ node, ...props }) => (
                    <h1 className="text-base font-semibold mt-4 mb-2 text-neutral-900" {...props} />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2 className="text-sm font-semibold mt-3 mb-1.5 text-neutral-900" {...props} />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3 className="text-xs font-semibold mt-2.5 mb-1 text-neutral-800" {...props} />
                  ),
                  p: ({ node, ...props }) => (
                    <p className="mb-2.5 text-neutral-700 leading-normal" {...props} />
                  ),
                  ul: ({ node, ...props }) => (
                    <ul className="list-disc list-outside pl-4 mb-2.5 space-y-1" {...props} />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol className="list-decimal list-outside pl-4 mb-2.5 space-y-1" {...props} />
                  ),
                  li: ({ node, ...props }) => (
                    <li className="text-neutral-700 leading-normal" {...props} />
                  ),
                  strong: ({ node, ...props }) => (
                    <strong className="font-semibold text-neutral-900" {...props} />
                  ),
                  blockquote: ({ node, ...props }) => (
                    <blockquote className="border-l-2 border-neutral-300 pl-3 italic my-2 text-neutral-600 text-xs" {...props} />
                  ),
                }}
              >
                {data.summary || "No summary available."}
              </MarkDown>
            </div>
          </div>
        </TabsContent>

        {/* Tab 2: Transcript */}
        <TabsContent value="transcript" className="mt-3">
          <Transcript meetingId={data.id} />
        </TabsContent>

        {/* Tab 3: Recording */}
        <TabsContent value="recording" className="mt-3">
          <div className="bg-white rounded-lg border shadow-xs p-4">
            {data.recordingUrl ? (
              <video
                src={data.recordingUrl}
                className="w-full rounded-md bg-black aspect-video shadow-xs max-h-[420px]"
                controls
              />
            ) : (
              <p className="text-xs text-muted-foreground text-center py-8">
                No recording available for this session.
              </p>
            )}
          </div>
        </TabsContent>

        {/* Tab 4: Chat */}
        <TabsContent value="chat" className="mt-3">
          <ChatProvider meetingId={data.id} meetingName={data.name} />
        </TabsContent>
      </Tabs>
    </div>
  );
};