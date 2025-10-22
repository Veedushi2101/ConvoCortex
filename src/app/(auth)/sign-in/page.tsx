import { auth } from "@/lib/auth";
import { SignInViews } from "@/module/auth/ui/views/sign-in-views";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const Page = async () => {
  const session = await auth.api.getSession({
      headers: await headers(),
    });
  
    if(!!session){
      redirect("/sign-in");
    }
  return (
    <SignInViews />
  );
};
export default Page;
