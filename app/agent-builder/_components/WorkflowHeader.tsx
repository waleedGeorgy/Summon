'use client'
import Link from "next/link";
import { formatDistance } from "date-fns";
import { ArrowLeft, CalendarCheck, Circle, ClipboardEdit, Hammer } from "lucide-react";
import { Workflow } from "@/convex/schema";
import { ThemeToggleButton } from "@/components/ThemeToggleButton";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PublishButton } from "./PublishButton";
import { CodeButton } from "./CodeButton";
import EditWorkflowButton from "./EditWorkflowButton";

const WorkflowHeader = ({ workflow, isPreviewMode = false }: { workflow: Workflow, isPreviewMode: boolean }) => {
  const formattedDate = formatDistance(workflow._creationTime, new Date(), { addSuffix: true });

  return (
    <nav className="flex items-center gap-2 justify-between px-4 py-2.5 bg-sidebar border-b">
      <div className="flex items-center gap-2">
        <Link href='/dashboard/workflows' title="Back to dashboard">
          <ArrowLeft className="hover:text-emerald-500 transition duration-300" />
        </Link>
        <div className="flex items-center gap-3">
          <h2 className="lg:text-xl text-base">{workflow.name}</h2>
          <Separator orientation="vertical" className='lg:inline hidden' />
          {workflow?.description &&
            <p className="text-xs dark:text-neutral-300 text-neutral-700 lg:inline hidden max-w-2xs">{workflow.description}</p>
          }
        </div>
        {!isPreviewMode && <EditWorkflowButton workflow={workflow} />}
      </div>
      <div className="flex items-center gap-2">
        <time className="flex items-center gap-2 lg:text-sm text-xs"><CalendarCheck className="lg:size-4 size-3.5" />{formattedDate}</time>
        <Separator orientation="vertical" />
        <span className="flex items-center gap-2 text-sm"><p className='hidden lg:inline'>Published</p> {workflow.isPublished ? <Circle className="fill-green-500 text-green-400 size-4" /> : <Circle className="fill-red-500 text-red-500 size-4" />}</span>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggleButton />
        {isPreviewMode ?
          <Link
            href={`/agent-builder/${workflow._id}`}
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            <ClipboardEdit /><span className='hidden lg:inline'>Editor</span>
          </Link>
          :
          <Link
            href={`/agent-builder/${workflow._id}/preview`}
            className={`${buttonVariants({ variant: "outline", size: "sm" })} 
            ${!workflow?.nodes || workflow.nodes?.length === 0 ? 'pointer-events-none opacity-50' : ''}`}
          >
            <Hammer />
            <span className='hidden lg:inline'>Build</span>
          </Link>
        }
        <CodeButton workflow={workflow} />
        <PublishButton workflow={workflow} />
      </div>
    </nav>
  )
}

export default WorkflowHeader