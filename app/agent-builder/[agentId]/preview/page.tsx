'use client'
import { useState, useEffect, useCallback, useTransition } from "react";
import { Background, BackgroundVariant, Controls, Edge, MiniMap, Panel, ReactFlow } from "@xyflow/react";
import { useParams } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { Loader2, RefreshCcw } from "lucide-react";
import { useTheme } from "next-themes";
import { CustomNode } from "@/convex/schema";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import AgentBuilderHeader from "../../_components/AgentBuilderHeader";
import { nodeTypes } from "../../_components/AgentBuilderNodesList";
import axios from 'axios'
import { Button } from "@/components/ui/button";
import { generatedConfig } from "@/types";

const WorkflowPreviewPage = () => {
    const { resolvedTheme } = useTheme();

    const [mounted, setMounted] = useState(false);
    const [generatedWorkflow, setGeneratedWorkflow] = useState<generatedConfig | null>(null);

    const [isGeneratingConfig, startGeneratingConfig] = useTransition();

    const updateAgentToolConfig = useMutation(api.agent.updateAgentToolConfig);

    const { agentId } = useParams();
    const agent = useQuery(api.agent.getAgentById, {
        agentId: agentId as Id<'Agents'> ?? 'skip'
    });

    const generateWorkflow = useCallback(() => {
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
        setGeneratedWorkflow(config);
    }, [agent]);

    const generateConfigFromWorkflow = () => {
        startGeneratingConfig(async () => {
            const result = await axios.post('/api/generate-config', {
                generatedWorkflow: generatedWorkflow
            });
            if (agent) await updateAgentToolConfig({ agentId: agent?._id, toolConfig: result.data });
        });
    }

    useEffect(() => {
        queueMicrotask(() => {
            setMounted(true);
        })
    }, []);

    useEffect(() => {
        if (agent) queueMicrotask(() => {
            generateWorkflow();
        })
    }, [agent, generateWorkflow]);

    if (!mounted) return null;

    if (!agent) return (
        <div className="flex items-center justify-center h-screen flex-1">
            <Loader2 className="size-15 animate-spin text-emerald-500" />
        </div>
    )

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
                <div className="col-span-1 border-l p-4 bg-sidebar flex items-center justify-center h-full">
                    {!agent.toolConfig &&
                        <Button size='lg' disabled={isGeneratingConfig} onClick={generateConfigFromWorkflow}>
                            <RefreshCcw className={`${isGeneratingConfig && 'animate-spin'}`} />Reboot agent
                        </Button>
                    }
                </div>
            </div>
        </div>
    )
}

export default WorkflowPreviewPage