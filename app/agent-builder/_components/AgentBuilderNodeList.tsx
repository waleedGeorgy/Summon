import { Handle, Position } from "@xyflow/react"
import { HatGlasses, Play } from "lucide-react"

const AgentNode = () => {
    return (
        <div className="flex items-center gap-2 dark:bg-indigo-700 dark:text-bg-indigo-50 bg-indigo-300 px-5 py-3 rounded-lg border">
            <HatGlasses className="dark:bg-indigo-900 bg-indigo-400 p-2 rounded-lg size-8 dark:text-bg-indigo-50" />
            <span>Agent</span>
            <Handle type="source" position={Position.Right} />
            <Handle type="target" position={Position.Left} />
        </div>
    )
}

const StartNode = () => {
    return (
        <div className="flex items-center gap-2 dark:bg-green-700 dark:text-green-50 bg-green-300 px-5 py-3 rounded-lg border">
            <Play className="dark:bg-green-900 bg-green-400 p-2 rounded-lg size-8 dark:text-green-50" />
            <span>Start</span>
            <Handle type="source" position={Position.Right} />
        </div>
    )
}

export const nodeTypes = {
    StartNode: StartNode,
    AgentNode: AgentNode
}