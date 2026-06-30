'use client'
import { useState, useEffect, useCallback, useTransition } from "react";
import { Background, BackgroundVariant, Controls, Edge, MiniMap, Panel, ReactFlow } from "@xyflow/react";
import { useParams, useRouter } from "next/navigation";
import axios from 'axios'
import { useMutation, useQuery } from "convex/react";
import { CheckCircle, Circle, Cog, XCircle } from "lucide-react";
import { useTheme } from "next-themes";
import { CustomNode } from "@/convex/schema";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { nodeTypes } from "../../_components/AgentBuilderNodesList";
import { Button } from "@/components/ui/button";
import PreviewChat from "./_components/PreviewChat";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import { toast } from "sonner";
import { GeneratedConfig } from "@/types";
import WorkflowHeader from "../../_components/WorkflowHeader";

const WorkflowPreviewPage = () => {
    const { resolvedTheme } = useTheme();

    const router = useRouter();

    const { workflowId } = useParams();
    const workflow = useQuery(api.workflow.getWorkflowById, {
        workflowId: workflowId as Id<'Workflows'> ?? 'skip'
    });

    const inaccessiblePreviewPage = workflow && (!workflow.nodes || workflow.nodes.length === 0) || workflow?.status === 'locked';

    useEffect(() => {
        if (inaccessiblePreviewPage) {
            router.replace(`/dashboard/workflows`);
        }
    }, [inaccessiblePreviewPage, router, workflow?.status]);

    const updateAgentConfig = useMutation(api.workflow.updateWorkflowConfig);

    const [mounted, setMounted] = useState(false);
    const [generatedWorkflow, setGeneratedWorkflow] = useState<GeneratedConfig | null>(null);
    const [conversationId, setConversationId] = useState<string | null>(null);

    const [isGeneratingConfig, startGeneratingConfig] = useTransition();

    const getConversationId = async () => {
        const res = await axios.get('/api/agent-chat');
        setConversationId(res.data.conversationId);
    }

    const generateWorkflow = useCallback(() => {
        const edgeMap = workflow?.edges.reduce((acc: Record<string, Edge[]>, edge: Edge) => {
            if (!acc[edge.source]) acc[edge.source] = [];
            acc[edge.source].push(edge);
            return acc;
        }, {} as Record<string, Edge[]>);

        const flow = workflow?.nodes?.map((node: CustomNode) => {
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

        const startNode = workflow?.nodes?.find((n: CustomNode) => n.type === 'StartNode');

        const config = {
            startNode: startNode?.id || null,
            flow
        }
        setGeneratedWorkflow(config);
    }, [workflow]);

    const generateConfigFromWorkflow = () => {
        startGeneratingConfig(async () => {
            try {
                const result = await axios.post('/api/generate-config', {
                    generatedWorkflow: generatedWorkflow
                });
                if (workflow) {
                    await updateAgentConfig({ workflowId: workflow?._id, config: result.data });

                    toast.success('Agent configuration generated', {
                        icon: <CheckCircle className="text-emerald-500" size={18} />
                    });
                }
            } catch (error) {
                toast.error('Error generating agent configuration', {
                    icon: <XCircle className="text-red-500" size={18} />
                });
                console.log('Error generating agent configuration ' + error)
            }
        });
    }

    useEffect(() => {
        queueMicrotask(() => {
            setMounted(true);
        })
    }, []);

    useEffect(() => {
        if (workflow) queueMicrotask(() => {
            generateWorkflow();
        })
    }, [generateWorkflow, workflow]);

    useEffect(() => {
        if (workflow) queueMicrotask(() => {
            getConversationId();
        })
    }, [workflow]);

    if (!mounted) return null;

    if (!workflow) return (
        <div className="flex items-center justify-center h-screen flex-1">
            <div className="flex items-center space-x-4">
                <Circle className="size-6 animate-bounce fill-emerald-500 text-emerald-500" style={{ animationDelay: '0ms' }} />
                <Circle className="size-6 animate-bounce fill-emerald-500 text-emerald-500" style={{ animationDelay: '150ms' }} />
                <Circle className="size-6 animate-bounce fill-emerald-500 text-emerald-500" style={{ animationDelay: '300ms' }} />
            </div>
        </div>
    );

    const flowColorMode = resolvedTheme === 'dark' ? 'dark' : 'light';

    return (
        <div className="h-screen flex flex-col">
            {workflow && <WorkflowHeader workflow={workflow} isPreviewMode={true} />}
            <ResizablePanelGroup orientation="horizontal" className="flex-1 w-full">
                <ResizablePanel defaultSize='70%' minSize='40%' collapsible={true}>
                    <div className="h-full w-full">
                        <ReactFlow
                            nodes={workflow?.nodes || []}
                            edges={workflow?.edges || []}
                            fitView={true}
                            nodeTypes={nodeTypes}
                            colorMode={flowColorMode}
                            draggable={false}
                        >
                            <Background variant={BackgroundVariant.Dots} size={1} gap={45} />
                            <MiniMap />
                            <Controls />
                            <Panel position="top-left">
                                <h3 className="text-xl font-light italic">Preview mode</h3>
                            </Panel>
                        </ReactFlow>
                    </div>
                </ResizablePanel>
                <ResizableHandle withHandle className="px-1.5 hover:bg-primary transition duration-200" />
                <ResizablePanel defaultSize='30%' minSize='25%' collapsible={true}>
                    <div className="h-full border-l bg-sidebar">
                        {!workflow.agentConfig ?
                            <div className="flex items-center justify-center h-full">
                                <Button
                                    size="lg"
                                    disabled={isGeneratingConfig}
                                    onClick={generateConfigFromWorkflow}
                                >
                                    <Cog className={`${isGeneratingConfig && 'animate-spin'}`} />Generate configuration
                                </Button>
                            </div>
                            :
                            <PreviewChat
                                generateConfigFromWorkflow={generateConfigFromWorkflow}
                                isGeneratingConfig={isGeneratingConfig}
                                workflow={workflow}
                                conversationId={conversationId}
                            />
                        }
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    )
}

export default WorkflowPreviewPage