'use client'
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { type Edge, ReactFlowProvider } from "@xyflow/react";
import { Circle } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import type { CustomNode } from "@/convex/schema"
import { NodesContext } from "@/context/NodesContext";
import WorkflowBuilder from "../_components/WorkflowBuilder";
import WorkflowHeader from "../_components/WorkflowHeader";

const WorkflowBuilderPage = () => {
    const [nodes, setNodes] = useState<CustomNode[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const [selectedNode, setSelectedNode] = useState<CustomNode | null>(null);

    const router = useRouter();

    const { workflowId } = useParams();
    const workflow = useQuery(api.workflow.getWorkflowById, {
        workflowId: workflowId as Id<'Workflows'> ?? 'skip'
    });

    const lockedWorkflow = workflow && workflow.status === 'locked';

    useEffect(() => {
        if (lockedWorkflow) {
            router.replace(`/dashboard/workflows`);
        }
    }, [router, lockedWorkflow]);

    if (!workflow) return (
        <div className="flex items-center justify-center h-screen flex-1">
            <div className="flex items-center space-x-4">
                <Circle className="size-6 animate-bounce fill-emerald-500 text-emerald-500" style={{ animationDelay: '0ms' }} />
                <Circle className="size-6 animate-bounce fill-emerald-500 text-emerald-500" style={{ animationDelay: '150ms' }} />
                <Circle className="size-6 animate-bounce fill-emerald-500 text-emerald-500" style={{ animationDelay: '300ms' }} />
            </div>
        </div>
    );

    return (
        <NodesContext.Provider value={{ nodes, setNodes, edges, setEdges, selectedNode, setSelectedNode }}>
            <ReactFlowProvider>
                <div className="h-screen flex flex-col">
                    {workflow && <WorkflowHeader workflow={workflow} isPreviewMode={false} />}
                    {workflow && <WorkflowBuilder workflow={workflow} />}
                </div>
            </ReactFlowProvider>
        </NodesContext.Provider>
    )
}

export default WorkflowBuilderPage