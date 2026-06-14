import { ThemeToggleButton } from "@/components/ThemeToggleButton"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { UserButton, useUser } from "@clerk/nextjs"

const Header = () => {
    const { isLoaded } = useUser();

    return (
        <header className="w-full flex items-center justify-between gap-2 px-4 py-2.5 bg-sidebar border-b border-sidebar-accent">
            <SidebarTrigger />
            <div className="items-center gap-2 flex">
                <ThemeToggleButton />
                {!isLoaded ?
                    <div className="size-8.5 bg-neutral-600 rounded-full animate-pulse" />
                    :
                    <UserButton appearance={{
                        elements: {
                            avatarBox: {
                                width: "2.1rem",
                                height: "2.1rem",
                            },
                        },
                    }} />
                }
            </div>
        </header>
    )
}

export default Header