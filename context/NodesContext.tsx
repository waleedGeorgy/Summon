// context/NodesContext.tsx
import { createContext, type Dispatch, type SetStateAction } from "react";
import { Node, Edge } from '@xyflow/react';
import { CustomNode } from "@/types";

interface NodesContextType {
    nodes: Node[];
    setNodes: Dispatch<SetStateAction<Node[]>>;
    edges: Edge[];
    setEdges: Dispatch<SetStateAction<Edge[]>>;
    selectedNode: CustomNode | null,
    setSelectedNode: Dispatch<SetStateAction<CustomNode | null>>;
}

export const NodesContext = createContext<NodesContextType | null>(null);