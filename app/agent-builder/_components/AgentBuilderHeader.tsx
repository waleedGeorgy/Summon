import Link from "next/link";
import { formatDistance } from "date-fns";
import { BookOpenCheck, CalendarCheck, ChevronLeft, Circle, Code2, Eye } from "lucide-react";
import { Agent } from "@/convex/schema";
import { ThemeToggleButton } from "@/components/ThemeToggleButton";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const AgentBuilderHeader = ({ agent }: { agent: Agent }) => {
  const formattedDate = formatDistance(agent._creationTime, new Date(), { addSuffix: true });

  return (
    <div className="flex items-center gap-2 justify-between px-4 py-2.5 bg-sidebar">
      <div className="flex items-center gap-2">
        <Link href='/dashboard'>
          <ChevronLeft className="hover:text-emerald-500 transition duration-300" />
        </Link>
        <div className="flex items-center gap-3">
          <h2 className="text-xl">{agent.name}</h2>
          <Separator orientation="vertical" />
          <p className="text-xs text-neutral-400 truncate">{agent.description}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <time className="flex items-center gap-2 text-sm"><CalendarCheck className="size-4" />{formattedDate}</time>
        <Separator orientation="vertical" />
        <span className="flex items-center gap-2 text-sm">Published {agent.isPublished ? <Circle className="fill-green-500 text-green-400 size-4" /> : <Circle className="fill-red-500 text-red-400 size-4" />}</span>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggleButton />
        <Button size='sm' variant='outline'><Code2 />Code</Button>
        <Button size='sm' variant='outline'><Eye />Preview</Button>
        <Button size='sm'><BookOpenCheck />Publish</Button>
      </div>
    </div>
  )
}

export default AgentBuilderHeader