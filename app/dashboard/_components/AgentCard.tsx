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
import { CheckCircle2, HatGlasses, XCircle, CalendarCheck2 } from "lucide-react"

const AgentCard = (agent: Agent) => {
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
                        <small><CheckCircle2 className="text-green-500 size-4" /></small>
                        :
                        <small><XCircle className="text-red-500 size-4" /></small>
                    }
                </CardContent>
                <CardFooter className="flex items-center gap-2">
                    <CalendarCheck2 className="size-4" />
                    <time>{new Date(agent._creationTime).toLocaleDateString("en-GB")}</time>
                </CardFooter>
            </Card>
        </Link>
    )
}

export default AgentCard