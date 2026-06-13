import { ThemeToggleButton } from "@/components/ThemeToggleButton"
import { Button } from "@/components/ui/button";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="flex items-center gap-3">
      <h1>Hello World!</h1>
      <ThemeToggleButton />
      <Show when="signed-out">
        <SignInButton mode='modal'>
          <Button>
            Sign In
          </Button>
        </SignInButton>
      </Show>
      <Show when="signed-in">
        <UserButton />
      </Show>
    </div>
  );
}
