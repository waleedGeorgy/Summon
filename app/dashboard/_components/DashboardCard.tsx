'use client'
import { MouseEvent, useTransition } from "react";
import Link from "next/link"
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
import { Workflow } from "@/convex/schema";

const DashboardCard = ({ workflow, icon: Icon, link }: { workflow: Workflow, icon: LucideIcon, link: string }) => {
    const formattedDate = formatDistance(workflow._creationTime, new Date(), { addSuffix: true });

    const deleteAgentMutation = useMutation(api.workflow.deleteWorkflow);

    const [isDeleting, startDeletingAgent] = useTransition();

    const deleteAgent = async (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        startDeletingAgent(async () => {
            try {
                await deleteAgentMutation({ workflowId: workflow._id });
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
            className={`group hover:-translate-y-1 dark:hover:brightness-125 transition-all duration-300 cursor-pointer ${isDeleting && 'pointer-events-none'} ${workflow.status === 'locked' && 'opacity-75 pointer-events-none'}`}
            href={link}
        >
            <Card size="sm" className={`min-w-2xs shadow hover:shadow-lg transition-shadow duration-300 ${workflow.status === 'locked' && 'outline outline-yellow-500'}`}>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        {workflow.status === 'locked' ? <LockKeyhole className="size-4 text-yellow-500" /> : <Icon className="size-4 text-emerald-500" />}
                        <span>{workflow.name}</span>
                    </CardTitle>
                    <CardDescription className="line-clamp-1">
                        {workflow.description && workflow.description?.length > 0 ?
                            workflow.description
                            :
                            <span className="italic text-neutral-400">No description</span>
                        }
                    </CardDescription>
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
                    {workflow.isPublished ?
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