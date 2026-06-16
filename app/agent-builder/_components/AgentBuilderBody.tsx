'use client'
import { useCallback, useState, useEffect, useContext } from "react";
import {
    ReactFlow,
    applyNodeChanges,
    applyEdgeChanges,
    addEdge,
    Background,
    BackgroundVariant,
    MiniMap,
    Controls,
    Panel,
    type NodeChange,
    type EdgeChange,
    type Connection,
    type Node,
    type Edge
} from '@xyflow/react';
import { useTheme } from "next-themes";
import AgentToolsPanel from "./AgentToolsPanel";
import AgentSettingsPanel from "./AgentSettingsPanel";
import { NodesContext } from "@/context/NodesContext";
import { Agent } from "@/convex/schema";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2, Save, XCircle } from "lucide-react";
import { toast } from "sonner";
import { nodeTypes } from "./AgentBuilderNodeList";

const AgentBuilderBody = ({ agent }: { agent: Agent }) => {
    const { resolvedTheme } = useTheme();

    const [isSaving, setIsSaving] = useState(false);

    const context = useContext(NodesContext);
    if (!context) throw new Error("NodesContext must be used within a Provider");

    const { nodes, setNodes, edges, setEdges } = context;

    useEffect(() => {
        if (agent) {
            setNodes(agent.nodes as Node[]);
            setEdges(agent.edges as Edge[]);
        }
    }, [agent, setNodes, setEdges]);

    const onNodesChange = useCallback(
        (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
        [setNodes],
    );
    const onEdgesChange = useCallback(
        (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        [setEdges],
    );
    const onConnect = useCallback(
        (connection: Connection) => setEdges((eds) => addEdge(connection, eds ?? [])),
        [setEdges],
    );

    const updateAgentMutation = useMutation(api.agent.updateAgentDetails);

    const saveAgentState = useCallback(async () => {
        setIsSaving(true)
        try {
            await updateAgentMutation({
                agentId: agent._id,
                nodes,
                edges
            });
            toast.success('Progress saved', {
                icon: <CheckCircle className="text-emerald-500" size={18} />
            });
        } catch (error) {
            console.log("Error saving progress " + error);
            toast.error('Failed to save progress', {
                icon: <XCircle className="text-red-500" size={18} />
            });
        } finally {
            setIsSaving(false)
        }
    }, [updateAgentMutation, agent._id, nodes, edges]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if ((event.ctrlKey || event.metaKey) && event.key === 's') {
                event.preventDefault();
                saveAgentState();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => { window.removeEventListener('keydown', handleKeyDown) };
    }, [saveAgentState]);

    const flowColorMode = resolvedTheme === 'dark' ? 'dark' : 'light';

    return (
        <div className="flex-1 w-full relative">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                colorMode={flowColorMode}
                fitView
                nodeTypes={nodeTypes}
            >
                <Controls />
                <MiniMap />
                <Background variant={BackgroundVariant.Dots} size={1} gap={25} />
                <Panel position="top-left">
                    <AgentToolsPanel />
                </Panel>
                <Panel position="top-right">
                    <AgentSettingsPanel />
                </Panel>
                <Panel position="bottom-center">
                    <Button onClick={saveAgentState} size='sm' disabled={isSaving}>
                        {isSaving ?
                            <><Loader2 className="animate-spin" />Saving</>
                            :
                            <><Save />Save (Ctrl + S)</>
                        }
                    </Button>
                </Panel>
            </ReactFlow>
        </div>
    )
}

export default AgentBuilderBody