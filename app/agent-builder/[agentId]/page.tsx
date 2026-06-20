'use client'
import { useState } from "react";
import { useParams } from "next/navigation";
import { type Edge, ReactFlowProvider } from "@xyflow/react";
import { Loader2 } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { NodesContext } from "@/context/NodesContext";
import type { CustomNode } from "@/convex/schema"
import AgentBuilderHeader from "../_components/AgentBuilderHeader"
import AgentBuilderBody from "../_components/AgentBuilderBody";

const AgentBuilderPage = () => {
    const [nodes, setNodes] = useState<CustomNode[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const [selectedNode, setSelectedNode] = useState<CustomNode | null>(null);

    const { agentId } = useParams();
    const agent = useQuery(api.agent.getAgentById, {
        agentId: agentId as Id<'Agents'> ?? 'skip'
    });

    if (!agent) return (
        <div className="flex items-center justify-center h-screen flex-1">
            <Loader2 className="size-15 animate-spin text-emerald-500" />
        </div>
    )

    return (
        <NodesContext.Provider value={{ nodes, setNodes, edges, setEdges, selectedNode, setSelectedNode }}>
            <ReactFlowProvider>
                <div className="h-screen flex flex-col">
                    {agent && <AgentBuilderHeader agent={agent} isPreviewMode={false} />}
                    {agent && <AgentBuilderBody agent={agent} />}
                </div>
            </ReactFlowProvider>
        </NodesContext.Provider>
    )
}

export default AgentBuilderPage