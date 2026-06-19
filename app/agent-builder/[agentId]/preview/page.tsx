'use client'
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import AgentBuilderHeader from "../../_components/AgentBuilderHeader";
import { Background, BackgroundVariant, Controls, MiniMap, Panel, ReactFlow } from "@xyflow/react";
import { nodeTypes } from "../../_components/AgentBuilderNodesList";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

const WorkflowPreviewPage = () => {
    const { resolvedTheme } = useTheme();

    const [mounted, setMounted] = useState(false);

    const { agentId } = useParams();
    const agent = useQuery(api.agent.getAgentById, {
        agentId: agentId as Id<'Agents'> ?? 'skip'
    });

    useEffect(() => {
        queueMicrotask(() => {
            setMounted(true);
        })
    }, []);

    if (!mounted) {
        return (
            <div className="flex items-center justify-center h-screen flex-1">
                <Loader2 className="size-14 text-emerald-500 animate-spin" />
            </div>
        )
    }

    const flowColorMode = resolvedTheme === 'dark' ? 'dark' : 'light';

    return (
        <div className="h-screen flex flex-col">
            {agent && <AgentBuilderHeader agent={agent} isPreviewMode={true} />}
            <div className="flex-1 w-full relative grid grid-cols-4">
                <div className="col-span-3">
                    <ReactFlow
                        nodes={agent?.nodes || []}
                        edges={agent?.edges || []}
                        fitView={true}
                        nodeTypes={nodeTypes}
                        colorMode={flowColorMode}
                        draggable={false}
                    >
                        <Background variant={BackgroundVariant.Dots} size={1} gap={25} />
                        <MiniMap />
                        <Controls />
                        <Panel position="top-left">
                            <h3 className="text-xl">Preview mode</h3>
                        </Panel>
                    </ReactFlow>
                </div>
                <div className="col-span-1 border-l p-4">
                    <h4>Chat UI</h4>
                </div>
            </div>
        </div>
    )
}

export default WorkflowPreviewPage