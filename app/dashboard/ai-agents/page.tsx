'use client'
import { HatGlasses } from "lucide-react";
import DashboardCard from "../_components/DashboardCard";
import { useWorkflows } from "@/hooks/use-workflows";

const AgentsPage = () => {
    const { workflows: agents } = useWorkflows();

    const publishedAgents = agents?.filter((agent) => agent.isPublished === true);

    return (
        <div className="flex flex-col">
            <h2 className="text-2xl md:px-12 px-6 mt-12">Published AI agents</h2>
            <div className="flex items-center flex-wrap gap-4 md:px-12 px-6 py-4">
                {!agents ?
                    [...Array(4)].map((_, id) => (
                        <div className="w-72 h-38 dark:bg-sidebar bg-neutral-400 animate-pulse rounded-xl" key={id} />
                    ))
                    : publishedAgents && publishedAgents.length > 0 ?
                        publishedAgents.map(publishedAgent => (
                            <DashboardCard
                                key={publishedAgent._id}
                                workflow={publishedAgent}
                                icon={HatGlasses}
                                link={`/agent-builder/${publishedAgent._id}/preview`}
                            />
                        ))
                        :
                        <p className="text-muted-foreground">No agents published yet.</p>
                }
            </div>
        </div>
    )
}

export default AgentsPage