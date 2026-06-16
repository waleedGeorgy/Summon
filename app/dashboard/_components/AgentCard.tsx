import Link from "next/link"
import { Agent } from "@/convex/schema"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { HatGlasses, CalendarCheck2, Circle } from "lucide-react"
import { formatDistance } from "date-fns";

const AgentCard = (agent: Agent) => {
    const formattedDate = formatDistance(agent._creationTime, new Date(), { addSuffix: true });

    return (
        <Link
            href={`/agent-builder/${agent._id}`}
            className="group hover:-translate-y-1 dark:hover:brightness-125 transition-all duration-300"
        >
            <Card size="sm" className="min-w-2xs shadow hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <HatGlasses className="size-4 text-emerald-600" />{agent.name}
                    </CardTitle>
                    {agent.description && agent.description?.length > 0 ?
                        <CardDescription className="line-clamp-1">
                            {agent.description}
                        </CardDescription>
                        :
                        <span className="italic text-gray-400">No description</span>
                    }
                </CardHeader>
                <CardContent className="flex items-center gap-2">
                    <span>Published</span>
                    {agent.isPublished ?
                        <small><Circle className="size-4 text-green-400 fill-green-500" /></small>
                        :
                        <small><Circle className="size-4 text-red-400 fill-red-500" /></small>
                    }
                </CardContent>
                <CardFooter className="flex items-center gap-2">
                    <CalendarCheck2 className="size-3.5" />
                    <time className="text-xs">{formattedDate}</time>
                </CardFooter>
            </Card>
        </Link>
    )
}

export default AgentCard