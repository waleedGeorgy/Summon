'use client'
import { ReactNode } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { DashboardSidebar } from "./_components/DashboardSidebar"
import DashboardHeader from "./_components/DashboardHeader"

const DashboardLayout = ({ children }: { children: ReactNode }) => {
    return (
        <SidebarProvider>
            <DashboardSidebar />
            <div className="w-full">
                <DashboardHeader />
                {children}
            </div>
        </SidebarProvider>
    )
}

export default DashboardLayout