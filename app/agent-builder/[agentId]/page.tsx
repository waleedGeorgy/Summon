'use client'
import AgentBuilderHeader from "../_components/AgentBuilderHeader"
import AgentBuilderBody from "../_components/AgentBuilderBody";
import { useState } from "react";
import { NodesContext } from "@/context/NodesContext";
import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import type { Node, Edge } from "@xyflow/react";

const AgentBuilderPage = () => {
    const [nodes, setNodes] = useState<Node[]>([]);

    const [edges, setEdges] = useState<Edge[]>([]);

    const { agentId } = useParams();
    const agent = useQuery(api.agent.getAgentById, {
        agentId: agentId as Id<'Agents'> ?? 'skip'
    });

    return (
        <NodesContext.Provider value={{ nodes, setNodes, edges, setEdges }}>
            <div className="h-screen flex flex-col">
                {agent && <AgentBuilderHeader agent={agent} />}
                {agent && <AgentBuilderBody agent={agent} />}
            </div>
        </NodesContext.Provider>
    )
}

export default AgentBuilderPage