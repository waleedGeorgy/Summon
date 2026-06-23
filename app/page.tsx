import Image from "next/image";
import Link from "next/link";
import { Show, SignInButton } from "@clerk/nextjs";
import {
  ArrowRight,
  GitBranch,
  Layers,
  Zap,
  BrainCircuit,
} from "lucide-react";
import { ThemeToggleButton } from "@/components/ThemeToggleButton";
import { Button } from "@/components/ui/button";
import SummonLogo from "@/public/logo.svg";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* ----- Header / Navigation ----- */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          {/* Logo */}
          <div className="flex items-center gap-2 text-xl tracking-wider">
            <div className="flex size-7 items-center justify-center">
              <Image src={SummonLogo} alt="Summon's logo" />
            </div>
            <h1>Summon</h1>
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-3">
            <ThemeToggleButton />
            <Show when="signed-out">
              <SignInButton mode="modal" forceRedirectUrl={"/dashboard/workflows"}>
                <Button size='sm' className="hidden sm:inline-flex">
                  Sign In
                </Button>
              </SignInButton>
            </Show>
          </div>
        </div>
      </header>

      {/* ----- Hero Section ----- */}
      <section className="relative flex-1 flex items-center justify-center px-4 pt-20 pb-32 md:pt-32 md:pb-40">
        {/* Subtle background gradient */}
        <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-secondary/20 dark:from-primary/10 dark:to-secondary/10 pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-4xl text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium bg-muted/50 backdrop-blur">
            <BrainCircuit className="mr-2 size-4 text-emerald-500" />
            Visual AI Agent Builder
          </div>

          <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Build intelligent agents
            <br />
            <span className="bg-linear-to-r from-emerald-500 to-indigo-500 bg-clip-text text-transparent">
              node by node.
            </span>
          </h2>

          <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl leading-relaxed">
            <strong className="underline underline-offset-2 decoration-dotted">Summon</strong> lets you design, connect, and deploy powerful
            AI workflows using an intuitive graph-based editor. Chain prompts,
            tools, and logic visually — no messy code required.
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Show when="signed-out">
              <SignInButton mode="modal" forceRedirectUrl={"/dashboard/workflows"}>
                <Button size="lg" className="w-full sm:w-auto group text-base">
                  Start building free
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </SignInButton>
            </Show>
            <Link href="#features">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-base">
                How it works
              </Button>
            </Link>
          </div>

          {/* Trusted by / subtle stats */}
          <div className="pt-8 flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-500" />
              <span>Visual editor</span>
            </div>
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-indigo-500" />
              <span>Reusable nodes</span>
            </div>
            <div className="flex items-center gap-2">
              <GitBranch className="h-4 w-4 text-emerald-500" />
              <span>Branching logic</span>
            </div>
          </div>
        </div>
      </section>

      {/* ----- Features Section ----- */}
      <section
        id="features"
        className="container px-4 md:px-6 py-20 md:py-32 border-t bg-muted/30 dark:bg-muted/10"
      >
        <div className="mx-auto max-w-6xl space-y-16">
          <div className="text-center space-y-4">
            <h3 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Design intelligence like a circuit board
            </h3>
            <p className="mx-auto max-w-2xl text-muted-foreground text-lg">
              Every agent is a graph. Every node is a step. Connect them
              visually to create complex, autonomous behaviors.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="group relative rounded-2xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 mb-5">
                <GitBranch className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Graph-Based Editor</h3>
              <p className="text-muted-foreground leading-relaxed">
                Drag, drop, and connect nodes on an infinite canvas. See your
                agent&apos;s decision flow at a glance using React Flow.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group relative rounded-2xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500 mb-5">
                <BrainCircuit className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Node Types</h3>
              <p className="text-muted-foreground leading-relaxed">
                Choose from LLM calls, tools, conditionals, and custom logic
                blocks. Each node runs its task when triggered.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group relative rounded-2xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 mb-5">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">One-Click Deploy</h3>
              <p className="text-muted-foreground leading-relaxed">
                Turn your graph into a running API endpoint or chat agent
                instantly. Iterate fast without touching infrastructure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ----- CTA / Footer-ish section ----- */}
      <section className="container px-4 md:px-6 py-20 text-center border-t">
        <div className="mx-auto max-w-2xl space-y-6">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to summon your first agent?
          </h2>
          <p className="text-muted-foreground text-lg">
            Join developers and creators who build autonomous workflows
            visually.
          </p>
          <Show when="signed-out">
            <SignInButton mode="modal" forceRedirectUrl={"/dashboard/workflows"}>
              <Button size="lg" className="group text-base">
                Get started free
                <ArrowRight className=" h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </SignInButton>
          </Show>
        </div>
      </section>

      {/* Simple footer */}
      <footer className="py-6 text-center text-sm text-muted-foreground bg-sidebar">
        <div className="container px-4 md:px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} Summon. Build with nodes.</p>
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:underline underline-offset-4">
              Privacy
            </Link>
            <Link href="#" className="hover:underline underline-offset-4">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}