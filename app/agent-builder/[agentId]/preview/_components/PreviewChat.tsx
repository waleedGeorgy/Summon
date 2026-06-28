import { KeyboardEvent, useEffect, useRef, useState, useTransition } from "react"
import { Loader2, RefreshCcw, SendHorizonal, XCircle } from "lucide-react"
import Markdown from 'react-markdown'
import { Agent } from "@/convex/schema"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"

interface PreviewChatProps {
    generateConfigFromWorkflow: () => void,
    isGeneratingConfig: boolean,
    agent: Agent,
    conversationId: string | null
}

const PreviewChat = ({ generateConfigFromWorkflow, isGeneratingConfig, agent, conversationId }: PreviewChatProps) => {
    const [userChatInput, setUserChatInput] = useState('');
    const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'assistant', contents: string }[]>([]);

    const [isSendingMessage, startSendingMessage] = useTransition();

    const lastMessageRef = useRef<HTMLDivElement | null>(null);
    const chatContainerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (lastMessageRef.current) {
            lastMessageRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'end'
            });
        }
    }, [chatMessages, isSendingMessage]);

    const sendMessage = () => {
        if (!userChatInput.trim() || isSendingMessage) return;

        setChatMessages([...chatMessages, { role: 'user', contents: userChatInput }]);
        setUserChatInput('');

        startSendingMessage(async () => {
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

                if (!response.ok) {
                    if (response.status === 429) {
                        const data = await response.json();
                        toast.error(`Rate limit exceeded. Try again in ${data.retryAfter} seconds.`, {
                            icon: <XCircle className="text-red-500" size={18} />
                        });
                        return;
                    }

                    const errorData = await response.json();
                    toast.error(errorData.error || 'Error generating response', {
                        icon: <XCircle className="text-red-500" size={18} />
                    });
                    return;
                }

                const reader = response.body?.getReader();
                if (!reader) return;

                const decoder = new TextDecoder();
                let done = false;

                setChatMessages((prev) => ([...prev, { role: 'assistant', contents: '' }]));

                while (!done) {
                    const { value, done: doneReading } = await reader.read();
                    done = doneReading;

                    if (value) {
                        const chunk = decoder.decode(value, { stream: true });

                        setChatMessages((prev) => {
                            const updatedChatOutput = [...prev];
                            updatedChatOutput[updatedChatOutput.length - 1] = {
                                role: 'assistant',
                                contents: (updatedChatOutput[updatedChatOutput.length - 1]?.contents || '') + chunk
                            }
                            return updatedChatOutput;
                        })
                    }
                }
            } catch (error) {
                toast.error('Error generating agent output', {
                    icon: <XCircle className="text-red-500" size={18} />
                });
                console.error("Stream error:", error);
            }
        })
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="w-full h-full px-2 py-3 flex flex-col">
            <div className="flex items-center gap-2 px-1 justify-between">
                <h3 className="font-semibold">{agent.name || "Agent"}</h3>
                <Button size='sm' disabled={isGeneratingConfig} onClick={generateConfigFromWorkflow}>
                    <RefreshCcw className={`${isGeneratingConfig && 'animate-spin'}`} />Regenerate agent
                </Button>
            </div>
            <Separator className='mt-2' />
            <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto space-y-3 flex flex-col px-1 py-3"
            >
                {chatMessages.length === 0 ?
                    <div className="flex items-center justify-center flex-1">
                        <p className="text-sm opacity-65 font-light">Nothing here yet. Say something to your agent!</p>
                    </div>
                    :
                    chatMessages.map((message, idx) => (
                        <div
                            key={idx}
                            className={`flex px-3.5 py-2 max-w-[75%] rounded-lg 
                            ${message.role === 'user' ? 'self-end bg-secondary shadow' : 'self-start'}`}
                        >
                            <div
                                className="text-sm leading-relaxed whitespace-pre-wrap"
                                ref={idx === chatMessages.length - 1 ? lastMessageRef : null}
                            >
                                <Markdown>{message.contents}</Markdown>
                            </div>
                        </div>
                    ))}
                {isSendingMessage &&
                    <div
                        className="flex items-center gap-2 px-2 justify-start animate-pulse"
                        ref={lastMessageRef}
                    >
                        <div className="size-5 border-b-3 border-neutral-700 dark:border-neutral-400 animate-spin rounded-full" />
                        <span className="italic text-sm font-light">Thinking</span>
                    </div>
                }
            </div>
            <Separator className='mb-3' />
            <div className="flex items-center gap-1.5">
                <Input
                    placeholder="Chat with your agent..."
                    className="flex-1 border rounded-lg px-3 py-2"
                    value={userChatInput}
                    onChange={(e) => setUserChatInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isSendingMessage}
                />
                <Button onClick={sendMessage} disabled={!userChatInput.trim() || isSendingMessage}>
                    {isSendingMessage ? <Loader2 className="animate-spin" /> : <SendHorizonal />}
                </Button>
            </div>
        </div>
    )
}

export default PreviewChat