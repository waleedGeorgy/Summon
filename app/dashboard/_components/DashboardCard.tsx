'use client'
import { MouseEvent, useTransition } from "react";
import Link from "next/link"
import { Agent } from "@/convex/schema"
import { useMutation } from "convex/react";
import { CalendarCheck2, Circle, Trash2, CheckCircle, XCircle, Loader2, LucideIcon, LockKeyhole } from "lucide-react"
import { formatDistance } from "date-fns";
import { api } from "@/convex/_generated/api";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const DashboardCard = ({ agent, icon: Icon, link }: { agent: Agent, icon: LucideIcon, link: string }) => {
    const formattedDate = formatDistance(agent._creationTime, new Date(), { addSuffix: true });

    const deleteAgentMutation = useMutation(api.agent.deleteAgent);

    const [isDeleting, startDeletingAgent] = useTransition();

    const deleteAgent = async (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        startDeletingAgent(async () => {
            try {
                await deleteAgentMutation({ agentId: agent._id });
                toast.success('Agent deleted successfully', {
                    icon: <CheckCircle className="text-emerald-500" size={18} />
                })
            } catch (error) {
                console.log("Error deleting agent: " + error);
                toast.error('Failed to delete agent', {
                    icon: <XCircle className="text-red-500" size={18} />
                });
            }
        });
    };

    return (
        <Link
            className={`group hover:-translate-y-1 dark:hover:brightness-125 transition-all duration-300 cursor-pointer ${isDeleting && 'pointer-events-none'} ${agent.status === 'locked' ? 'opacity-60 pointer-events-none' : ''}`}
            href={link}
        >
            <Card size="sm" className="min-w-2xs shadow hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        {agent.status === 'locked' ? <LockKeyhole className="size-4 text-yellow-500" /> : <Icon className="size-4 text-emerald-500" />}
                        <span>{agent.name}</span>
                    </CardTitle>
                    {agent.description && agent.description?.length > 0 ?
                        <CardDescription className="line-clamp-1">
                            {agent.description}
                        </CardDescription>
                        :
                        <span className="italic text-neutral-400">No description</span>
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
                        <small><Circle className="size-3.5 text-green-500 fill-green-500" /></small>
                        :
                        <small><Circle className="size-3.5 text-red-500 fill-red-500" /></small>
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

export default DashboardCard