'use client'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Wallet2, Database, User2, Gem, HatGlasses } from "lucide-react"
import { useUser } from "@clerk/nextjs"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"

export function AppSidebar() {
    const { user, isLoaded } = useUser();
    const currentUser = useQuery(api.user.getUserById, { userId: user?.id ?? "skip" })

    const { open } = useSidebar();

    const pathname = usePathname();

    const menuItems = [
        {
            name: 'Dashboard',
            href: '/dashboard',
            icon: LayoutDashboard,
        },
        {
            name: 'AI Agents',
            href: '/ai-agents',
            icon: HatGlasses,
        },
        {
            name: 'Data',
            href: '/data',
            icon: Database,
        },
        {
            name: 'Pricing',
            href: '/pricing',
            icon: Wallet2,
        },
        {
            name: 'Profile',
            href: '/profile',
            icon: User2,
        },
    ]

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader className="flex flex-row items-center gap-3 px-4">
                <Image alt="Summon Logo" src={'/logo.svg'} width={30} height={30} />
                {open && <h1 className="text-xl tracking-wide">Summon</h1>}
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menuItems.map(item => (
                                <SidebarMenuItem key={item.name}>
                                    <Link href={item.href}>
                                        <SidebarMenuButton size={open ? "lg" : "default"} isActive={pathname === item.href}>
                                            <item.icon />
                                            <span>{item.name}</span>
                                        </SidebarMenuButton>
                                    </Link>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            {open &&
                <SidebarFooter className="flex flex-row items-center gap-2 pb-5 px-5">
                    <Gem className="size-3.5" />
                    <div className="flex items-center gap-1">
                        <span className="text-sm">
                            Credits:
                        </span>
                        {!currentUser || !isLoaded ?
                            <div className="w-10 h-3.5 rounded bg-neutral-600 animate-pulse" />
                            :
                            <span className="text-sm">{currentUser?.tokens}</span>
                        }
                    </div>
                </SidebarFooter>
            }
        </Sidebar>
    )
}