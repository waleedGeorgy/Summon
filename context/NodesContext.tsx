import { createContext, type Dispatch, type SetStateAction } from "react";
import { Edge } from '@xyflow/react';
import { CustomNode } from "@/convex/schema";

interface NodesContextType {
    nodes: CustomNode[];
    setNodes: Dispatch<SetStateAction<CustomNode[]>>;
    edges: Edge[];
    setEdges: Dispatch<SetStateAction<Edge[]>>;
    selectedNode: CustomNode | null,
    setSelectedNode: Dispatch<SetStateAction<CustomNode | null>>;
}

export const NodesContext = createContext<NodesContextType | null>(null);