import { Fragment, KeyboardEvent, useEffect, useRef, useState, useTransition } from "react"
import { BrainCircuit, RefreshCcw, SendHorizonal, XCircle } from "lucide-react"
import Markdown from 'react-markdown'
import { Workflow } from "@/convex/schema"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { addSeconds, formatDistanceToNowStrict } from "date-fns"

interface PreviewChatProps {
    generateConfigFromWorkflow: () => void,
    isGeneratingConfig: boolean,
    workflow: Workflow,
    conversationId: string | null
}

const PreviewChat = ({ generateConfigFromWorkflow, isGeneratingConfig, workflow, conversationId }: PreviewChatProps) => {
    const [userChatInput, setUserChatInput] = useState('');
    const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'assistant', contents: string, hasError?: boolean }[]>([]);

    const [isSendingMessage, startSendingMessage] = useTransition();

    const focusRef = useRef<HTMLInputElement | null>(null);
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

        const messageIndex = chatMessages.length;

        setChatMessages([...chatMessages, { role: 'user', contents: userChatInput }]);
        setUserChatInput('');

        startSendingMessage(async () => {
            try {
                const response = await fetch('/api/agent-chat', {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        input: userChatInput,
                        tools: workflow?.agentConfig?.tools || [],
                        agents: workflow?.agentConfig?.agents || [],
                        agentName: workflow?.name,
                        convId: conversationId,
                    }),
                });

                if (!response.ok) {
                    if (response.status === 429) {
                        const data = await response.json();

                        setChatMessages((prev) =>
                            prev.map((msg, idx) =>
                                idx === messageIndex ? { ...msg, hasError: true } : msg
                            )
                        );

                        const retryAfterSeconds = parseInt(data.retryAfter) || 60;
                        const retryDate = addSeconds(new Date(), retryAfterSeconds);
                        const formattedTime = formatDistanceToNowStrict(retryDate);

                        toast.error(`Rate limit exceeded. Try again in ${formattedTime}.`, {
                            icon: <XCircle className="text-red-500" size={18} />
                        });
                        return;
                    }

                    const errorData = await response.json();

                    setChatMessages((prev) =>
                        prev.map((msg, idx) =>
                            idx === messageIndex ? { ...msg, hasError: true } : msg
                        )
                    );

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
                setChatMessages((prev) =>
                    prev.map((msg, idx) =>
                        idx === messageIndex ? { ...msg, hasError: true } : msg
                    )
                );

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
                <h3 className="font-semibold">{workflow.name || "Agent"}</h3>
                <Button size='sm' disabled={isGeneratingConfig} onClick={generateConfigFromWorkflow}>
                    <BrainCircuit className={`${isGeneratingConfig && 'animate-spin'}`} />Regenerate agent
                </Button>
            </div>
            <Separator className='mt-2' />
            <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto space-y-3 flex flex-col px-1 py-3"
            >
                {chatMessages.length === 0 ?
                    <div className="flex items-center justify-center flex-1">
                        <p className="text-sm opacity-65 font-light">Say something to your agent!</p>
                    </div>
                    :
                    chatMessages.map((message, idx) => (
                        <Fragment key={idx}>
                            <div
                                className={`flex px-3.5 py-2 max-w-[75%] rounded-lg
                                    ${message.role === 'user' ? 'self-end shadow bg-secondary rounded-br-none' : 'self-start rounded-bl-none'}`}
                            >
                                <div className="text-sm leading-relaxed whitespace-pre-wrap">
                                    <Markdown>{message.contents}</Markdown>
                                </div>
                            </div>
                            <div className="self-end flex flex-row-reverse items-center gap-2 -mt-3">
                                {message.hasError && (
                                    <div className=" text-xs text-destructive flex items-center gap-1 px-1">
                                        <XCircle size={13} />
                                        Error generating response
                                    </div>
                                )}
                                {message.role === 'user' && message.hasError && (
                                    <Button
                                        variant="outline"
                                        size="xs"
                                        onClick={() => {
                                            setUserChatInput(message.contents);
                                            focusRef.current?.focus()
                                        }}
                                    >
                                        <RefreshCcw />Retry
                                    </Button>
                                )}
                            </div>
                        </Fragment>
                    ))
                }
                {isSendingMessage &&
                    <div
                        className="flex items-center gap-2.5 px-2 justify-start animate-pulse"
                        ref={lastMessageRef}
                    >
                        <div className="size-4 border-b-2 border-dotted border-neutral-700 dark:border-neutral-400 animate-spin rounded-full" />
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
                    ref={focusRef}
                />
                <Button onClick={sendMessage} disabled={!userChatInput.trim() || isSendingMessage}>
                    <SendHorizonal />
                </Button>
            </div>
        </div>
    )
}

export default PreviewChat