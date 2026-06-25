import { Workflow } from "lucide-react";
import { Agent } from "@/convex/schema";
import DashboardCard from "../../_components/DashboardCard";

const MyAgents = ({ agents, isLoading }: { agents: Agent[], isLoading: boolean }) => {
    return (
        <div className="flex items-center flex-wrap gap-4 md:px-12 px-6 py-4">
            {isLoading ?
                [...Array(4)].map((_, id) => (
                    <div className="w-72 h-38 dark:bg-sidebar bg-neutral-400 animate-pulse rounded-xl" key={id} />
                ))
                : agents && agents.length > 0 ?
                    agents.map(agent => (
                        <DashboardCard key={agent._id} agent={agent} icon={Workflow} link={`/agent-builder/${agent._id}`} />
                    ))
                    :
                    <p className="text-muted-foreground">No agents found</p>
            }
        </div>
    )
}

export default MyAgents