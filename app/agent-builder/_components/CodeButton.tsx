"use client";
import { useState, useEffect, useCallback } from "react";
import { Copy, ExternalLink, Loader2, CopyCheck, Code2, LockKeyhole } from "lucide-react";
import { HighlightCodeAction } from "@/components/HighlightCodeAction";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";
import { getBaseUrl } from "@/lib/base-url";
import { Workflow } from "@/convex/schema";

export const CodeButton = ({ workflow }: { workflow: Workflow }) => {
    const [copied, setCopied] = useState(false);
    const [highlightedHtml, setHighlightedHtml] = useState("");
    const [loading, setLoading] = useState(false);

    const { isPaidUser, isLoading } = useCurrentUser();

    const snippet = `
// How to call your "${workflow.name || "Agent"}"
async function chatWithAgent(userId, message, conversationId = null) {
  const res = await fetch('${getBaseUrl()}/api/agent-sdk', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      agentId: '${workflow._id}',
      userId: userId,
      input: message,
      conversationId: conversationId,
    }),
  });

  const newConvId = res.headers.get('X-Conversation-Id');

  if (!res.body) return;

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let result = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value, { stream: true });
    result += chunk;
    // 'result' now contains agent's output
  }
  return { response: result, conversationId: newConvId };
}

// Usage example
const userId = "user-123"; // your user identifier
chatWithAgent(userId, "Hello, what can you do?").then(({ conversationId }) => {
  // Next message uses the returned conversationId
  chatWithAgent(userId, "What's the weather?", conversationId);
});
`.trim();

    const loadHighlightedCode = useCallback(async () => {
        setLoading(true);
        try {
            const html = await HighlightCodeAction(snippet);
            setHighlightedHtml(html);
        } catch (error) {
            console.error("Failed to highlight code:", error);
            setHighlightedHtml(snippet);
        } finally {
            setLoading(false);
        }
    }, [snippet]);

    useEffect(() => {
        if (!highlightedHtml && !loading) {
            queueMicrotask(() => {
                loadHighlightedCode();
            })
        }
    }, [highlightedHtml, loadHighlightedCode, loading]);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(snippet);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Dialog>
            <DialogTrigger render={
                <Button
                    variant='outline'
                    size="sm"
                    disabled={!workflow?.agentConfig || !workflow.isPublished || isLoading || (!isPaidUser && !isLoading)}
                >
                    {isLoading ?
                        <Code2 className="size-4" />
                        : !isPaidUser ?
                            <LockKeyhole className="text-yellow-500 size-4" />
                            :
                            <Code2 className="size-4" />}
                    Code
                </Button>
            }>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <ExternalLink className="size-5" />
                        API Snippet for &quot;{workflow?._id}&quot;
                    </DialogTitle>
                    <DialogDescription>
                        Copy this code into any JavaScript / TypeScript app to use your agent.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                            Replace <code className="px-1 py-0.5 bg-muted rounded">userId</code> with your own user identifier and <code className="px-1 py-0.5 bg-muted rounded">conversationId</code> with the value returned by the first call.
                        </p>

                        {/* Code Block */}
                        <div className="relative rounded-md border bg-[#282c34] max-h-[60vh] overflow-auto">
                            {loading && !highlightedHtml ? (
                                <div className="flex items-center justify-center p-8">
                                    <Loader2 className="size-5 animate-spin" />
                                </div>
                            ) : highlightedHtml ? (
                                <div
                                    className="p-4 text-sm [&_pre]:whitespace-pre-wrap! [&_pre]:wrap-break-word! [&_pre]:overflow-x-auto"
                                    dangerouslySetInnerHTML={{ __html: highlightedHtml }}
                                />
                            ) : (
                                <pre className="p-4 text-sm whitespace-pre-wrap wrap-break-word">
                                    {snippet}
                                </pre>
                            )}

                            {/* Copy Button */}
                            <Button
                                variant="ghost"
                                size="icon-lg"
                                className="absolute top-2 right-2"
                                onClick={handleCopy}
                            >
                                {copied ? <CopyCheck className="text-green-400" /> : <Copy />}
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};