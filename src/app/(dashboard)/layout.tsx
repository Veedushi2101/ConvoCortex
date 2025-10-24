import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardNavbar } from "@/module/dashboard/ui/views/dashboard-navbar";
import { DashboardSidebar } from "@/module/dashboard/ui/views/dashboard-sidebar";

interface Props {
    children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <SidebarProvider>
        <DashboardSidebar/>
        <main className="flex flex-col h-screen w-screen bg-muted">
          <DashboardNavbar />
        {children}
        </main>
    </SidebarProvider>
  )
}

export default Layout