'use client'
import { SidebarProvider } from "@/components/ui/sidebar"
import { ReactNode } from "react"
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