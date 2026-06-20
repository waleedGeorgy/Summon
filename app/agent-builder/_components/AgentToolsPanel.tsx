import { useCallback, useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import { HatGlasses, Play, Repeat2, Split, SquareArrowRightExit, ThumbsUp, Webhook } from "lucide-react"
import type { CustomNode } from "@/convex/schema"
import { Separator } from "@/components/ui/separator"
import { NodesContext } from "@/context/NodesContext";

const agentTools = [
  {
    name: 'Start',
    icon: Play,
    color: '#22c55e',
    id: 'start',
    type: 'StartNode'
  },
  {
    name: 'Output',
    icon: SquareArrowRightExit,
    color: '#f43f5e',
    id: 'output',
    type: 'OutputNode'
  },
  {
    name: 'Agent',
    icon: HatGlasses,
    color: '#6366f1',
    id: 'agent',
    type: 'AgentNode'
  },
  {
    name: 'API',
    icon: Webhook,
    color: '#3b82f6',
    id: 'api',
    type: 'ApiNode'
  },
  {
    name: 'If/Else',
    icon: Split,
    color: '#f97316',
    id: 'ifElse',
    type: 'IfElseNode'
  },
  {
    name: 'While',
    icon: Repeat2,
    color: '#84cc16',
    id: 'while',
    type: 'WhileNode'
  },
  {
    name: 'Approval',
    icon: ThumbsUp,
    color: '#f59e0b',
    id: 'approval',
    type: 'ApprovalNode'
  },
];

const getPositionForNewNode = (existingNodes: CustomNode[]) => {
  const baseX = 0;
  const baseY = 0;
  const offset = existingNodes?.length ? existingNodes.length * 20 : 0;

  return {
    x: baseX + (offset % 400),
    y: baseY + Math.floor(offset / 300) * 50
  };
};

const AgentToolsPanel = () => {
  const context = useContext(NodesContext);

  const onAgentToolClick = useCallback((tool: typeof agentTools[0]) => {
    if (!context) return;

    const { nodes, setNodes } = context;

    const nodeRandomString = uuidv4();
    const nodeId = `${tool.id}-${nodeRandomString}`;

    const newNode: CustomNode = {
      id: nodeId,
      type: tool.type,
      position: getPositionForNewNode(nodes),
      data: { label: tool.name, color: tool.color, id: tool.id, type: tool.type },
      selected: false,
      measured: { width: 0, height: 0 },
    }

    if (!nodes) setNodes([newNode]);
    else setNodes(prev => [...prev, newNode])
  }, [context]);

  if (!context) return null;

  return (
    <div className="bg-sidebar/80 backdrop-blur-lg min-w-44 p-3 flex flex-col gap-1 justify-center rounded-lg border">
      <h3 className="font-semibold text-center">Nodes</h3>
      <Separator />
      {agentTools.map(tool => (
        <div
          key={tool.id}
          className="flex items-center gap-2 cursor-pointer hover:bg-sidebar-accent px-3 py-2 rounded-xl transition duration-300"
          onClick={() => onAgentToolClick(tool)}
        >
          <tool.icon className="size-7 p-1 rounded" style={{ color: tool.color }} />
          <span className="text-sm">{tool.name}</span>
        </div>
      ))}
    </div>
  )
}

export default AgentToolsPanel