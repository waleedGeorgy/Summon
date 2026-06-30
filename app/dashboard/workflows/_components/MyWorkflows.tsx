import { WorkflowIcon } from "lucide-react";
import DashboardCard from "../../_components/DashboardCard";
import { Workflow } from "@/convex/schema";

const MyWorkflows = ({ workflows, isLoading }: { workflows: Workflow[], isLoading: boolean }) => {
    return (
        <div className="flex items-center flex-wrap gap-4 md:px-12 px-6 py-4">
            {isLoading ?
                [...Array(4)].map((_, id) => (
                    <div className="w-72 h-38 dark:bg-sidebar bg-neutral-400 animate-pulse rounded-xl" key={id} />
                ))
                : workflows && workflows.length > 0 ?
                    workflows.map(workflow => (
                        <DashboardCard key={workflow._id} workflow={workflow} icon={WorkflowIcon} link={`/agent-builder/${workflow._id}`} />
                    ))
                    :
                    <p className="text-muted-foreground">No agents found</p>
            }
        </div>
    )
}

export default MyWorkflows