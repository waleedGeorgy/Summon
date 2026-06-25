'use client'
import Link from "next/link";
import { formatDistance } from "date-fns";
import { ArrowLeft, CalendarCheck, Circle, ClipboardEdit, Eye } from "lucide-react";
import { Agent } from "@/convex/schema";
import { ThemeToggleButton } from "@/components/ThemeToggleButton";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PublishButton } from "./PublishButton";
import { CodeButton } from "./CodeButton";

const AgentBuilderHeader = ({ agent, isPreviewMode = false }: { agent: Agent, isPreviewMode: boolean }) => {
  const formattedDate = formatDistance(agent._creationTime, new Date(), { addSuffix: true });

  return (
    <nav className="flex items-center gap-2 justify-between px-4 py-2.5 bg-sidebar border-b">
      <div className="flex items-center gap-2">
        <Link href='/dashboard/workflows' title="Back to dashboard">
          <ArrowLeft className="hover:text-emerald-500 transition duration-300" />
        </Link>
        <div className="flex items-center gap-3">
          <h2 className="md:text-2xl text-lg">{agent.name}</h2>
          <Separator orientation="vertical" className='lg:inline hidden' />
          <p className="text-xs dark:text-neutral-300 text-neutral-700 lg:inline hidden max-w-2xs">{agent.description}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <time className="flex items-center gap-2 lg:text-sm text-xs"><CalendarCheck className="lg:size-4 size-3.5" />{formattedDate}</time>
        <Separator orientation="vertical" />
        <span className="flex items-center gap-2 text-sm"><p className='hidden lg:inline'>Published</p> {agent.isPublished ? <Circle className="fill-green-500 text-green-400 size-4" /> : <Circle className="fill-red-500 text-red-500 size-4" />}</span>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggleButton />
        {isPreviewMode ?
          <Link
            href={`/agent-builder/${agent._id}`}
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            <ClipboardEdit /><span className='hidden md:inline'>Editor</span>
          </Link>
          :
          <Link
            href={`/agent-builder/${agent._id}/preview`}
            className={`${buttonVariants({ variant: "outline", size: "sm" })} 
            ${!agent?.nodes || agent.nodes?.length === 0 ? 'pointer-events-none opacity-50' : ''}`}
          >
            <Eye className="mr-1" /><span className='hidden md:inline'>Preview</span>
          </Link>
        }
        <CodeButton agentId={agent._id} agentName={agent.name} isAgentPublished={agent.isPublished} />
        <PublishButton agentId={agent._id} agentName={agent.name} />
      </div>
    </nav>
  )
}

export default AgentBuilderHeader