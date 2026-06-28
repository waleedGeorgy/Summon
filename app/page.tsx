"use client";
import { useRef } from "react";
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
import { Button } from "@/components/ui/button";
import SummonLogo from "@/public/logo.svg";
import { motion, useInView } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
};

const fadeInScale = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

const featuresContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const featureCardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

const ctaContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.2,
    },
  },
};

const ctaItemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
};

export default function Home() {
  const featuresRef = useRef(null);
  const isFeaturesInView = useInView(featuresRef, {
    once: true,
    margin: "-100px",
  });

  const ctaRef = useRef(null);
  const isCtaInView = useInView(ctaRef, {
    once: true,
    margin: "-100px",
  });

  return (
    <main className="flex min-h-screen flex-col">
      {/* ----- Hero Section ----- */}
      <section className="relative flex-1 flex items-center justify-center px-4 pt-20 pb-32 md:pt-32 md:pb-40">
        {/* Subtle background gradient */}
        <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-secondary/20 dark:from-primary/10 dark:to-secondary/10 pointer-events-none" />

        <motion.div
          className="relative z-10 mx-auto max-w-4xl text-center space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div
            className="flex items-center justify-center gap-2"
            variants={itemVariants}
          >
            <motion.div
              className="flex size-12 items-center justify-center"
              variants={fadeInScale}
            >
              <Image src={SummonLogo} alt="Summon's logo" />
            </motion.div>
            <motion.h1 className="text-5xl" variants={itemVariants}>
              Summon
            </motion.h1>
          </motion.div>

          <motion.h2
            className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
            variants={itemVariants}
          >
            Build intelligent agents
            <br />
            <span className="bg-linear-to-r from-emerald-500 to-indigo-500 bg-clip-text text-transparent">
              node by node.
            </span>
          </motion.h2>

          <motion.p
            className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl leading-relaxed"
            variants={itemVariants}
          >
            <strong className="underline underline-offset-2 decoration-dotted">
              Summon
            </strong>{" "}
            lets you design, connect, and deploy powerful AI workflows using an
            intuitive graph-based editor. Chain prompts, tools, and logic
            visually — no messy code required.
          </motion.p>

          {/* Hero CTAs */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            variants={itemVariants}
          >
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
          </motion.div>

          {/* Trusted by / subtle stats */}
          <motion.div
            className="pt-8 flex items-center justify-center gap-8 text-sm text-muted-foreground"
            variants={itemVariants}
          >
            <motion.div
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Zap className="h-4 w-4 text-amber-500" />
              <span>Visual editor</span>
            </motion.div>
            <motion.div
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Layers className="h-4 w-4 text-indigo-500" />
              <span>Reusable nodes</span>
            </motion.div>
            <motion.div
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <GitBranch className="h-4 w-4 text-emerald-500" />
              <span>Branching logic</span>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ----- Features Section with Scroll Animation ----- */}
      <motion.section
        ref={featuresRef}
        id="features"
        className="container px-4 md:px-6 py-20 md:py-32 border-t bg-muted/30 dark:bg-muted/10"
        initial="hidden"
        animate={isFeaturesInView ? "visible" : "hidden"}
        variants={featuresContainerVariants}
      >
        <div className="mx-auto max-w-6xl space-y-16">
          <motion.div className="text-center space-y-4" variants={featureCardVariants}>
            <h3 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Design intelligence like a circuit board
            </h3>
            <p className="mx-auto max-w-2xl text-muted-foreground text-lg">
              Every agent is a graph. Every node is a step. Connect them
              visually to create complex, autonomous behaviors.
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <motion.div
              className="group relative rounded-2xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
              variants={featureCardVariants}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 mb-5">
                <GitBranch className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Graph-Based Editor</h3>
              <p className="text-muted-foreground leading-relaxed">
                Drag, drop, and connect nodes on an infinite canvas. See your
                agent&apos;s decision flow at a glance using React Flow.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              className="group relative rounded-2xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
              variants={featureCardVariants}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500 mb-5">
                <BrainCircuit className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Node Types</h3>
              <p className="text-muted-foreground leading-relaxed">
                Choose from LLM calls, tools, conditionals, and custom logic
                blocks. Each node runs its task when triggered.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              className="group relative rounded-2xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
              variants={featureCardVariants}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 mb-5">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">One-Click Deploy</h3>
              <p className="text-muted-foreground leading-relaxed">
                Turn your graph into a running API endpoint or chat agent
                instantly. Iterate fast without touching infrastructure.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* ----- CTA Section with Scroll Animation ----- */}
      <motion.section
        ref={ctaRef}
        className="container px-4 md:px-6 py-20 text-center border-t"
        initial="hidden"
        animate={isCtaInView ? "visible" : "hidden"}
        variants={ctaContainerVariants}
      >
        <div className="mx-auto max-w-2xl space-y-6">
          <motion.h2
            className="text-3xl font-bold tracking-tight sm:text-4xl"
            variants={ctaItemVariants}
          >
            Ready to summon your first agent?
          </motion.h2>

          <motion.p
            className="text-muted-foreground text-lg"
            variants={ctaItemVariants}
          >
            Join developers and creators who build autonomous workflows
            visually.
          </motion.p>

          <motion.div variants={ctaItemVariants}>
            <Show when="signed-out">
              <SignInButton mode="modal" forceRedirectUrl={"/dashboard/workflows"}>
                <Button size="lg" className="group text-base">
                  Get started free
                  <ArrowRight className=" h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </SignInButton>
            </Show>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-muted-foreground bg-sidebar">
        <div className="container px-4 md:px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} Summon. All rights reserved.</p>
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