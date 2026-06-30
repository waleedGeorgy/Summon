'use client'
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Wallet2, Gem, HatGlasses, Workflow, Circle } from "lucide-react"
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
import { useCurrentUser } from "@/hooks/use-current-user"
import { useWorkflows } from "@/hooks/use-workflows"

const menuItems = [
    {
        name: 'Workflows',
        href: '/dashboard/workflows',
        icon: Workflow,
    },
    {
        name: 'AI Agents',
        href: '/dashboard/ai-agents',
        icon: HatGlasses,
    },
    {
        name: 'Pricing',
        href: '/dashboard/pricing',
        icon: Wallet2,
    },
];

export function DashboardSidebar() {
    const { isLoading, isPaidUser } = useCurrentUser();

    const { remainingWorkflows } = useWorkflows();

    const { open } = useSidebar();

    const pathname = usePathname();

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader className="flex flex-row items-center gap-3 px-4">
                <Image alt="Summon Logo" src={'/logo.svg'} width={30} height={30} />
                {open && <h1 className="text-2xl">Summon</h1>}
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
                <SidebarFooter className="flex flex-col pb-5 px-5">
                    <div className="flex items-center gap-2">
                        <Gem className="size-3.5" />
                        <div className="flex items-center gap-2">
                            <span className="text-sm">
                                Credits:
                            </span>
                            {isLoading ?
                                <div className="flex items-center space-x-1">
                                    <Circle className="size-2.5 animate-bounce fill-emerald-500 text-emerald-500" style={{ animationDelay: '0ms' }} />
                                    <Circle className="size-2.5 animate-bounce fill-emerald-500 text-emerald-500" style={{ animationDelay: '150ms' }} />
                                    <Circle className="size-2.5 animate-bounce fill-emerald-500 text-emerald-500" style={{ animationDelay: '300ms' }} />
                                </div>
                                :
                                isPaidUser ?
                                    <span className="text-sm text-yellow-500 font-semibold">Unlimited</span>
                                    :
                                    <span className="text-sm">{remainingWorkflows} / 2</span>
                            }
                        </div>
                    </div>
                </SidebarFooter>
            }
        </Sidebar>
    )
}