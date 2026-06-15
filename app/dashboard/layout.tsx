'use client'
import { ReactNode } from "react"
import { Toaster } from "@/components/ui/sonner"
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
            <Toaster />
        </SidebarProvider>
    )
}

export default DashboardLayout