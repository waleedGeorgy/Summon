'use client'
import { ReactNode } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "./_components/DashboardSidebar"
import Header from "./_components/Header"

const DashboardLayout = ({ children }: { children: ReactNode }) => {
    return (
        <SidebarProvider>
            <AppSidebar />
            <div className="w-full">
                <Header />
                {children}
            </div>
        </SidebarProvider>
    )
}

export default DashboardLayout