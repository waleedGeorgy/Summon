'use client'
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import AgentBuilderHeader from "../../_components/AgentBuilderHeader";
import { Background, BackgroundVariant, Controls, Edge, MiniMap, Panel, ReactFlow } from "@xyflow/react";
import { nodeTypes } from "../../_components/AgentBuilderNodesList";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { CustomNode } from "@/convex/schema";

const WorkflowPreviewPage = () => {
    const { resolvedTheme } = useTheme();

    const [mounted, setMounted] = useState(false);

    const { agentId } = useParams();
    const agent = useQuery(api.agent.getAgentById, {
        agentId: agentId as Id<'Agents'> ?? 'skip'
    });

    const generateWorkflow = () => {
        const edgeMap = agent?.edges.reduce((acc: Record<string, Edge[]>, edge: Edge) => {
            if (!acc[edge.source]) acc[edge.source] = [];
            acc[edge.source].push(edge);
            return acc;
        }, {} as Record<string, Edge[]>);

        const flow = agent?.nodes?.map((node: CustomNode) => {
            const connectedEdges = edgeMap[node.id] || [];

            let next = null;

            switch (node.type) {
                case 'IfElseNode': {
                    const ifEdge = connectedEdges.find((e: Edge) => e.sourceHandle === 'if');
                    const elseEdge = connectedEdges.find((e: Edge) => e.sourceHandle === 'else');

                    next = {
                        if: ifEdge?.target || null,
                        else: elseEdge?.target || null
                    }
                    break;
                }

                case 'AgentNode': {
                    if (connectedEdges.length === 1) next = connectedEdges[0].target;
                    else if (connectedEdges.length > 1) next = connectedEdges.map((e: Edge) => e.target);
                    break;
                }

                case 'ApiNode': {
                    if (connectedEdges.length === 1) next = connectedEdges[0].target;
                    break;
                }

                case 'ApprovalNode': {
                    if (connectedEdges.length === 1) next = connectedEdges[0].target;
                    break;
                }

                case 'StartNode': {
                    if (connectedEdges.length === 1) next = connectedEdges[0].target;
                    break;
                }

                case 'EndNode': {
                    next = null;
                    break;
                }

                default: {
                    if (connectedEdges.length === 1) next = connectedEdges[0].target;
                    else if (connectedEdges.length > 1) next = connectedEdges.map((e: Edge) => e.target);
                    break;
                }
            }
            return {
                id: node.id,
                type: node.type,
                label: node.data?.label || node.type,
                settings: node.data?.settings || {},
                next
            }
        });

        const startNode = agent?.nodes?.find((n: CustomNode) => n.type === 'StartNode');

        const config = {
            startNode: startNode?.id || null,
            flow
        }

        console.log("Workflow config: ", JSON.stringify(config));
    }

    useEffect(() => {
        queueMicrotask(() => {
            setMounted(true);
        })
    }, []);

    useEffect(() => {
        if (agent) generateWorkflow();
    }, [agent]);

    if (!mounted) return null;

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
                        <Background variant={BackgroundVariant.Dots} size={1} gap={45} />
                        <MiniMap />
                        <Controls />
                        <Panel position="top-left">
                            <h3 className="text-xl">Preview mode</h3>
                        </Panel>
                    </ReactFlow>
                </div>
                <div className="col-span-1 border-l p-4 bg-sidebar">
                    <h4>Chat UI</h4>
                </div>
            </div>
        </div>
    )
}

export default WorkflowPreviewPage