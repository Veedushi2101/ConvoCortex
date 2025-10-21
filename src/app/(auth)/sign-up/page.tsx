import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SignUpViews } from "@/module/auth/ui/views/sign-up-views";

const Page = async () => {
 const session = await auth.api.getSession({
     headers: await headers(),
   })
 
   if(!!session) {
     redirect("/");
   }
  return (
    <SignUpViews />
  );
}
export default Page;