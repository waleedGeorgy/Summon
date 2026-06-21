import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Agent } from "@/convex/schema"
import { RefreshCcw, SendHorizonal } from "lucide-react"
import { useState } from "react"

interface PreviewChatProps {
    generateConfigFromWorkflow: () => void,
    isGeneratingConfig: boolean,
    agent: Agent,
    conversationId: string | null
}

const PreviewChat = ({ generateConfigFromWorkflow, isGeneratingConfig, agent, conversationId }: PreviewChatProps) => {
    const [userChatInput, setUserChatInput] = useState('');

    const sendMessage = async () => {
        try {
            const response = await fetch('/api/agent-chat', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    input: userChatInput,
                    tools: agent?.config?.tools || [],
                    agents: agent?.config?.agents || [],
                    agentName: agent?.name,
                    convId: conversationId,
                }),
            });

            if (!response.ok) return;

            const reader = response.body?.getReader();
            if (!reader) return;

            const decoder = new TextDecoder();
            let done = false;

            while (!done) {
                const { value, done: doneReading } = await reader.read();
                done = doneReading;
                if (value) {
                    const text = decoder.decode(value, { stream: true });
                    console.log("Stream chunk:", text);
                }
            }
        } catch (error) {
            console.error("Stream error:", error);
        }
    };

    return (
        <div className="w-full h-full px-4 py-3 flex flex-col">
            <div className="flex items-center gap-2 justify-between">
                <h3 className="font-semibold">{agent.name || "Agent"}</h3>
                <Button size='sm' disabled={isGeneratingConfig} onClick={generateConfigFromWorkflow}>
                    <RefreshCcw className={`${isGeneratingConfig && 'animate-spin'}`} />Reboot agent
                </Button>
            </div>
            <Separator className='mt-2' />
            <div className="flex-1 overflow-y-auto space-y-2 flex flex-col">
                <div className="flex justify-start">
                    <div className="p-2 rounded-lg max-w-[75%] text-sidebar-accent-foreground">
                        <p className=" leading-relaxed">This is a demo chat. This will be a longer message to test multiline messages</p>
                    </div>
                </div>
                <div className="flex justify-end ">
                    <div className="px-3 py-2 rounded-lg max-w-[75%] bg-sidebar-accent text-sidebar-accent-foreground shadow">
                        <p className="leading-relaxed">Can you show the design idea?</p>
                    </div>
                </div>
                <div className="flex justify-start items-center gap-2 opacity-75 animate-pulse">
                    <div className="animate-spin rounded-full size-4 border-sidebar-accent-foreground border-t-2 border-b-2" />
                    <span className="italic text-sm font-light">Thinking...</span>
                </div>
            </div>
            <Separator className='mb-3' />
            <div className="flex items-center gap-1.5">
                <Input
                    placeholder="Chat with your agent..."
                    className="flex-1 border rounded-lg px-3 py-2"
                    value={userChatInput}
                    onChange={(e) => setUserChatInput(e.target.value)}
                />
                <Button onClick={sendMessage} disabled={!userChatInput.trim()}><SendHorizonal /></Button>
            </div>
        </div>
    )
}

export default PreviewChat