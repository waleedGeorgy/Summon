import { Agent } from "@/convex/schema";
import AgentCard from "./AgentCard";

const MyAgents = ({ agents, isLoading }: { agents: Agent[], isLoading: boolean }) => {
    return (
        <div className="flex items-center flex-wrap gap-4">
            {isLoading ? (
                [...Array(4)].map((_, id) => (
                    <div className="w-72 h-38 dark:bg-sidebar bg-neutral-400 animate-pulse rounded-xl" key={id} />
                ))
            ) : agents && agents.length > 0 ? (
                agents.map((agent) => (
                    <AgentCard key={agent._id} {...agent} />
                ))
            ) : (
                <p className="text-muted-foreground">No agents found</p>
            )}
        </div>
    )
}

export default MyAgents