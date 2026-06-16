'use client'
import { useRouter } from "next/navigation"
import { Agent } from "@/convex/schema"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { HatGlasses, CalendarCheck2, Circle, Trash2, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { formatDistance } from "date-fns";
import { Button } from "@/components/ui/button";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { MouseEvent, useState } from "react";

const AgentCard = (agent: Agent) => {
    const router = useRouter();
    const formattedDate = formatDistance(agent._creationTime, new Date(), { addSuffix: true });

    const deleteAgentMutation = useMutation(api.agent.deleteAgent);

    const [isDeleting, setIsDeleting] = useState(false);

    const deleteAgent = async (e: MouseEvent) => {
        setIsDeleting(true);

        e.preventDefault();
        e.stopPropagation();

        try {
            await deleteAgentMutation({ agentId: agent._id });
            toast.success('Agent deleted', {
                icon: <CheckCircle className="text-emerald-500" size={18} />
            })
        } catch (error) {
            console.log("Error deleting agent: " + error);
            toast.error('Failed to delete agent', {
                icon: <XCircle className="text-red-500" size={18} />
            });
        } finally {
            setIsDeleting(false);
        }
    }

    const handleCardClick = (e: MouseEvent) => {
        e.preventDefault();
        router.push(`/agent-builder/${agent._id}`);
    }

    return (
        <div
            className={`group hover:-translate-y-1 dark:hover:brightness-125 transition-all duration-300 cursor-pointer ${isDeleting && 'pointer-events-none'}`}
            onClick={handleCardClick}
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
                    <CardAction>
                        <Button
                            size='icon-sm'
                            variant='ghost'
                            onClick={deleteAgent}
                            disabled={isDeleting}
                        >
                            {isDeleting ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4 text-red-400" />}
                        </Button>
                    </CardAction>
                </CardHeader>
                <CardContent className="flex items-center gap-2">
                    <span>Published</span>
                    {agent.isPublished ?
                        <small><Circle className="size-3.5 text-green-400 fill-green-500" /></small>
                        :
                        <small><Circle className="size-3.5 text-red-400 fill-red-500" /></small>
                    }
                </CardContent>
                <CardFooter className="flex items-center gap-2">
                    <CalendarCheck2 className="size-3.5" />
                    <time className="text-xs">{formattedDate}</time>
                </CardFooter>
            </Card>
        </div>
    )
}

export default AgentCard