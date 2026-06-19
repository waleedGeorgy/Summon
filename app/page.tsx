import { Show, SignInButton, UserButton } from "@clerk/nextjs";
import { ThemeToggleButton } from "@/components/ThemeToggleButton"
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex items-center gap-3">
      <h1>Main Page</h1>
      <ThemeToggleButton />
      <Show when="signed-out">
        <SignInButton mode='modal' forceRedirectUrl={"/dashboard"}>
          <Button>
            Sign In
          </Button>
        </SignInButton>
      </Show>
      <Show when="signed-in">
        <UserButton />
        <Link href='/dashboard'>Dashboard</Link>
      </Show>
    </main>
  );
}
