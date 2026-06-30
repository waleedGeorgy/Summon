'use client'
import { useCallback, useEffect, useContext, useTransition } from "react";
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
    useOnSelectionChange,
    type NodeChange,
    type EdgeChange,
    type Connection,
    type Edge,
    type OnSelectionChangeParams,
} from '@xyflow/react';
import { CheckCircle, Loader2, Save, XCircle } from "lucide-react";
import { useTheme } from "next-themes";
import { useMutation } from "convex/react";
import { Workflow, CustomNode } from "@/convex/schema";
import { api } from "@/convex/_generated/api";
import { NodesContext } from "@/context/NodesContext";
import AgentToolsPanel from "./AgentToolsPanel";
import SettingsPanel from "./SettingsPanel";
import { nodeTypes } from "./AgentBuilderNodesList";
import { Button } from "@/components/ui/button";
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { toast } from "sonner";

const WorkflowBuilder = ({ workflow }: { workflow: Workflow }) => {
    const { resolvedTheme } = useTheme();

    const [isAgentSaving, startAgentSaving] = useTransition();

    const context = useContext(NodesContext);
    if (!context) throw new Error("NodesContext must be used within a Provider");

    const { nodes, setNodes, edges, setEdges, setSelectedNode } = context;

    useEffect(() => {
        if (workflow) {
            setNodes(workflow.nodes as CustomNode[]);
            setEdges(workflow.edges as Edge[]);
        }
    }, [setNodes, setEdges, workflow]);

    const onNodesChange = useCallback(
        (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds) as CustomNode[]),
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

    const updateWorkflowMutation = useMutation(api.workflow.updateWorkflowNodesAndEdges);

    const saveAgentState = useCallback(async () => {
        startAgentSaving(async () => {
            try {
                await updateWorkflowMutation({
                    workflowId: workflow._id,
                    nodes,
                    edges
                });
                toast.success('Workflow saved', {
                    icon: <CheckCircle className="text-emerald-500" size={18} />
                });
            } catch (error) {
                console.log("Error saving workflow " + error);
                toast.error('Failed to save workflow', {
                    icon: <XCircle className="text-red-500" size={18} />
                });
            }
        })
    }, [updateWorkflowMutation, workflow._id, nodes, edges]);

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

    const onNodeSelect = useCallback(({ nodes }: OnSelectionChangeParams) => {
        setSelectedNode(nodes[0] ? (nodes[0] as CustomNode) : null);
    }, [setSelectedNode]);

    useOnSelectionChange({
        onChange: onNodeSelect
    });

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
                fitView={true}
                nodeTypes={nodeTypes}
                deleteKeyCode={['Delete', 'Backspace']}
                connectionDragThreshold={5}
            >
                <Background variant={BackgroundVariant.Dots} size={1} gap={25} />
                <MiniMap />
                <Controls />
                <Panel position="top-left">
                    <AgentToolsPanel />
                </Panel>
                <Panel position="top-right">
                    <SettingsPanel />
                </Panel>
                <Panel position="bottom-center" className="flex items-center gap-3">
                    <Button onClick={saveAgentState} disabled={isAgentSaving}>
                        {isAgentSaving ?
                            <><Loader2 className="animate-spin" />Saving</>
                            :
                            <>
                                <Save />Save
                                <KbdGroup>
                                    <Kbd>Ctrl</Kbd>
                                    <span>+</span>
                                    <Kbd>S</Kbd>
                                </KbdGroup>
                            </>
                        }
                    </Button>
                    <KbdGroup className="text-xs dark:text-neutral-400 text-neutral-600">
                        <Kbd>Delete</Kbd>
                        <span>or</span>
                        <Kbd>Backspace</Kbd>
                        <span>to delete node</span>
                    </KbdGroup>
                </Panel>
            </ReactFlow>
        </div>
    )
}

export default WorkflowBuilder