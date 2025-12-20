"use client";

import { MeetingsListHeader } from "@/module/meetings/ui/components/meetings-list-header";
import { MeetingsView } from "@/module/meetings/ui/views/meetings-view";

export const HomeView = () => {
  return (
    <div>
      <MeetingsListHeader />
      <MeetingsView />
    </div>
  );
};
