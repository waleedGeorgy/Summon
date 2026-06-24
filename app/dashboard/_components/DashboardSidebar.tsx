'use client'
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Wallet2, User2, Gem, HatGlasses, Workflow } from "lucide-react"
import { useAuth, useUser } from "@clerk/nextjs"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
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
import { Button } from "@/components/ui/button"

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
    {
        name: 'Profile',
        href: '/dashboard/profile',
        icon: User2,
    },
];

export function DashboardSidebar() {
    const { user, isLoaded } = useUser();
    const currentUser = useQuery(api.user.getUserById, { userId: user?.id ?? "skip" });

    const { has } = useAuth();
    const isPaidUser = has({ plan: 'unlimited_plan' });

    const { open } = useSidebar();

    const pathname = usePathname();

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader className="flex flex-row items-center gap-3 px-4">
                <Image alt="Summon Logo" src={'/logo.svg'} width={30} height={30} />
                {open && <h1 className="text-2xl tracking-wider">Summon</h1>}
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
                        <div className="flex items-center gap-1">
                            <span className="text-sm">
                                Credits:
                            </span>
                            {!currentUser || !isLoaded ?
                                <div className="w-10 h-3.5 rounded bg-neutral-600 animate-pulse" />
                                :
                                isPaidUser ?
                                    <span className="text-sm text-yellow-500 font-semibold">Unlimited</span>
                                    :
                                    <span className="text-sm">{currentUser?.tokens} / 2</span>
                            }
                        </div>
                    </div>
                    {!isPaidUser &&
                        <Link href='/dashboard/pricing'>
                            <Button size='sm'>
                                Upgrade to unlimited
                            </Button>
                        </Link>
                    }
                </SidebarFooter>
            }
        </Sidebar>
    )
}