// context/NodesContext.tsx
import { createContext } from "react";
import { Node, Edge } from '@xyflow/react';
import { Dispatch, SetStateAction } from "react";

interface NodesContextType {
    nodes: Node[];
    setNodes: Dispatch<SetStateAction<Node[]>>;
    edges: Edge[];
    setEdges: Dispatch<SetStateAction<Edge[]>>;
}

export const NodesContext = createContext<NodesContextType | null>(null);