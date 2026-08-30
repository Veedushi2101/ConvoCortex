import { GeneratedAvatar } from "@/components/generated-avatar";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { authClient } from "@/lib/auth-client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon, CreditCardIcon, LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

export const DashboardUserButton = () => {
  const router = useRouter();
  const isMobile = useIsMobile();
  const { data, isPending } = authClient.useSession();

  const onLogOut = () => {
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/sign-in");
        },
      },
    });
  };

  if (isPending || !data?.user) {
    return null;
  }

  const triggerContent = (
    <div className="rounded-xl border border-purple-500/20 p-2.5 w-full flex items-center justify-between bg-white/[0.03] hover:bg-white/[0.06] transition-all cursor-pointer">
      <div className="flex items-center gap-2.5 min-w-0">
        {data?.user.image ? (
          <Avatar className="size-8 rounded-lg border border-purple-500/30">
            <AvatarImage src={data.user.image} />
          </Avatar>
        ) : (
          <GeneratedAvatar
            seed={data.user.name}
            variant="initials"
            className="size-8 rounded-lg border border-purple-500/30"
          />
        )}
        <div className="flex flex-col text-left overflow-hidden">
          <p className="text-xs font-semibold text-white truncate">{data.user.name}</p>
          <p className="text-[10px] text-purple-300/50 truncate">{data.user.email}</p>
        </div>
      </div>
      <ChevronDownIcon className="size-3.5 text-purple-300/50 shrink-0 ml-2" />
    </div>
  );

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger className="w-full">{triggerContent}</DrawerTrigger>
        <DrawerContent className="bg-[#120424] border-t border-purple-500/20 text-white">
          <DrawerHeader>
            <DrawerTitle>{data.user.name}</DrawerTitle>
            <DrawerDescription className="text-purple-300/60">{data.user.email}</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter className="gap-2">
            <Button variant="outline" className="border-purple-500/20 bg-white/[0.04] text-white hover:bg-white/[0.08]">
              <CreditCardIcon className="size-4 mr-2 text-[#F77F00]" /> Billing
            </Button>
            <Button variant="outline" onClick={onLogOut} className="border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20">
              <LogOutIcon className="size-4 mr-2" /> Log Out
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="w-full focus:outline-none">{triggerContent}</DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="right" className="w-64 bg-[#120424] border border-purple-500/20 text-white shadow-2xl backdrop-blur-xl p-1.5 rounded-xl">
        <DropdownMenuLabel className="p-2">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-white truncate">{data.user.name}</span>
            <span className="text-[11px] font-normal text-purple-300/60 truncate">{data.user.email}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-purple-500/15" />
        <DropdownMenuItem className="flex items-center justify-between text-xs py-2 text-purple-200 hover:text-white hover:bg-purple-500/20 rounded-lg cursor-pointer">
          <span>Billing</span>
          <CreditCardIcon className="size-3.5 text-[#f8f4f1]" />
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex items-center justify-between text-xs py-2 text-rose-300 hover:text-rose-200 hover:bg-rose-500/10 rounded-lg cursor-pointer"
          onClick={onLogOut}
        >
          <span>Log Out</span>
          <LogOutIcon className="size-3.5 text-[#f8f4f1]" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};