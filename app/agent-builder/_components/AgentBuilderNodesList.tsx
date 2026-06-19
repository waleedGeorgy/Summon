import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CustomNodeSettings } from "@/types"
import { Handle, Position } from "@xyflow/react"
import { HatGlasses, Play, Repeat2, Split, SquareArrowRightExit, ThumbsUp, Webhook } from "lucide-react"

const AgentNode = ({ selected, data }: { selected: boolean, data: CustomNodeSettings }) => {
    return (
        <div className={`flex items-center gap-2 dark:bg-indigo-700 dark:text-bg-indigo-50 bg-indigo-200 px-5 py-3 rounded-lg border relative dark:hover:brightness-110 hover:brightness-97 transition-all duration-200 ${selected && 'ring-2 ring-indigo-500 dark:ring-indigo-400'}`}>
            <HatGlasses className="dark:bg-indigo-900 bg-indigo-300 p-2 rounded-lg size-8 dark:text-bg-indigo-50" />
            <span>{data?.settings?.name || "Agent"}</span>
            <Handle type="source" position={Position.Right} />
            <Handle type="target" position={Position.Left} />
        </div>
    )
}

const StartNode = ({ selected }: { selected: boolean }) => {
    return (
        <div className={`flex items-center gap-2 dark:bg-green-700 dark:text-green-50 bg-green-200 px-5 py-3 rounded-lg border relative dark:hover:brightness-110 hover:brightness-97 transition-all duration-200 ${selected && 'ring-2 ring-green-500 dark:ring-green-400'}`}>
            <Play className="dark:bg-green-900 bg-green-300 p-2 rounded-lg size-8 dark:text-green-50" />
            <span>Start</span>
            <Handle type="source" position={Position.Right} />
        </div>
    )
}

const OutputNode = ({ selected }: { selected: boolean }) => {
    return (
        <div className={`flex items-center gap-2 dark:bg-rose-700 dark:text-rose-50 bg-rose-200 px-5 py-3 rounded-lg border relative dark:hover:brightness-110 hover:brightness-97 transition-all duration-200 ${selected && 'ring-2 ring-rose-500 dark:ring-rose-400'}`}>
            <SquareArrowRightExit className="dark:bg-rose-900 bg-rose-300 p-2 rounded-lg size-8 dark:text-rose-50" />
            <span>Output</span>
            <Handle type="target" position={Position.Left} />
        </div>
    )
}

const IfElseNode = ({ selected, data }: { selected: boolean, data: CustomNodeSettings }) => {
    return (
        <div className={`flex flex-col justify-center items-center gap-4 dark:bg-orange-700 dark:text-orange-50 bg-orange-200 pt-3 rounded-lg border relative dark:hover:brightness-110 hover:brightness-97 transition-all duration-200 ${selected && 'ring-2 ring-orange-500 dark:ring-orange-400'}`}>
            <div className="flex items-center gap-2">
                <Split className="dark:bg-orange-900 bg-orange-300 p-2 rounded-lg size-8 dark:text-orange-50" />
                <span>If/Else</span>
            </div>
            <div className="max-w-56 bg-sidebar p-3 rounded-lg space-y-2">
                <Input value={data.settings?.ifCondition || "If condition"} disabled />
                <Input value={data.settings?.elseCondition || "Else condition"} disabled />
            </div>
            <Handle type="target" position={Position.Left} style={{ top: 90 }} />
            <Handle type="source" position={Position.Right} id={'if'} style={{ top: 90 }} />
            <Handle type="source" position={Position.Right} id={'else'} style={{ top: 135 }} />
        </div>
    )
}

const WhileNode = ({ selected, data }: { selected: boolean, data: CustomNodeSettings }) => {
    return (
        <div className={`flex flex-col justify-center items-center gap-4 dark:bg-lime-700 dark:text-lime-50 bg-lime-200 pt-3 rounded-lg border relative dark:hover:brightness-110 hover:brightness-97 transition-all duration-200 ${selected && 'ring-2 ring-lime-500 dark:ring-lime-400'}`}>
            <div className="flex items-center gap-2">
                <Repeat2 className="dark:bg-lime-900 bg-lime-300 p-2 rounded-lg size-8 dark:text-lime-50" />
                <span>While</span>
            </div>
            <div className="max-w-56 bg-sidebar p-3 rounded-lg">
                <Input value={data.settings?.whileCondition || "While condition"} disabled />
            </div>
            <Handle type="target" position={Position.Left} style={{ top: 90 }} />
            <Handle type="source" position={Position.Right} style={{ top: 90 }} />
        </div>
    )
}

const ApprovalNode = ({ selected }: { selected: boolean }) => {
    return (
        <div className={`flex flex-col justify-center items-center gap-4 dark:bg-amber-700 dark:text-amber-50 bg-amber-200 pt-3 rounded-lg border relative dark:hover:brightness-110 hover:brightness-97 transition-all duration-200 ${selected && 'ring-2 ring-amber-500 dark:ring-amber-400'}`}>
            <div className="flex items-center gap-2">
                <ThumbsUp className="dark:bg-amber-900 bg-amber-300 p-2 rounded-lg size-8 dark:text-amber-50" />
                <span>Approval</span>
            </div>
            <div className="flex flex-col bg-sidebar px-12 py-3 rounded-lg space-y-2">
                <Button variant='outline'>Approve</Button>
                <Button variant='outline'>Reject</Button>
            </div>
            <Handle type="target" position={Position.Left} style={{ top: 90 }} />
            <Handle type="source" position={Position.Right} style={{ top: 90 }} id={'approve'} />
            <Handle type="source" position={Position.Right} style={{ top: 135 }} id={'reject'} />
        </div>
    )
}

const ApiNode = ({ selected, data }: { selected: boolean, data: CustomNodeSettings }) => {
    return (
        <div className={`flex items-center gap-2 dark:bg-blue-700 dark:text-bg-blue-50 bg-blue-200 px-5 py-3 rounded-lg border relative dark:hover:brightness-110 hover:brightness-97 transition-all duration-200 ${selected && 'ring-2 ring-blue-500 dark:ring-blue-400'}`}>
            <Webhook className="dark:bg-blue-900 bg-blue-300 p-2 rounded-lg size-8 dark:text-bg-blue-50" />
            <span>{data.settings?.apiName || "API"}</span>
            <Handle type="source" position={Position.Right} />
            <Handle type="target" position={Position.Left} />
        </div>
    )
}

export const nodeTypes = {
    StartNode: StartNode,
    AgentNode: AgentNode,
    OutputNode: OutputNode,
    IfElseNode: IfElseNode,
    WhileNode: WhileNode,
    ApprovalNode: ApprovalNode,
    ApiNode: ApiNode
}