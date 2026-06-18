'use client'
import { useState } from "react";
import { useParams } from "next/navigation";
import { type Edge, ReactFlowProvider } from "@xyflow/react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { NodesContext } from "@/context/NodesContext";
import AgentBuilderHeader from "../_components/AgentBuilderHeader"
import AgentBuilderBody from "../_components/AgentBuilderBody";
import type { CustomNode } from "@/convex/schema"

const AgentBuilderPage = () => {
    const [nodes, setNodes] = useState<CustomNode[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const [selectedNode, setSelectedNode] = useState<CustomNode | null>(null);

    const { agentId } = useParams();
    const agent = useQuery(api.agent.getAgentById, {
        agentId: agentId as Id<'Agents'> ?? 'skip'
    });

    return (
        <NodesContext.Provider value={{ nodes, setNodes, edges, setEdges, selectedNode, setSelectedNode }}>
            <ReactFlowProvider>
                <div className="h-screen flex flex-col">
                    {agent && <AgentBuilderHeader agent={agent} />}
                    {agent && <AgentBuilderBody agent={agent} />}
                </div>
            </ReactFlowProvider>
        </NodesContext.Provider>
    )
}

export default AgentBuilderPage