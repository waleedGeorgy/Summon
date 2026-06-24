"use client";
import { useState, useEffect, useCallback } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, Copy, ExternalLink, Share2, Loader2, CopyCheck } from "lucide-react";
import { HighlightCodeAction } from "@/components/HighlightCodeAction";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";

interface PublishButtonProps {
  agentId: Id<"Agents">;
  agentName?: string;
}

export const PublishButton = ({ agentId, agentName }: PublishButtonProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [highlightedHtml, setHighlightedHtml] = useState("");
  const [loading, setLoading] = useState(false);

  const agent = useQuery(api.agent.getAgentById, { agentId: agentId });
  const togglePublish = useMutation(api.agent.togglePublishAgent);

  const isPublished = agent?.isPublished ?? false;

  const snippet = `
// How to call your "${agentName || "Agent"}" from any app
async function chatWithAgent(userId, message, conversationId = null) {
  const res = await fetch('${typeof window !== "undefined" ? window.location.origin : "http://localhost:3000"}/api/agent-sdk', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      agentId: '${agentId}',
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
    if (dialogOpen && !highlightedHtml && !loading) {
      queueMicrotask(() => {
        loadHighlightedCode();
      })
    }
  }, [dialogOpen, highlightedHtml, loadHighlightedCode, loading]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTogglePublish = async () => {
    if (!isPublished) setDialogOpen(true);
    else await togglePublish({ agentId: agentId, isPublished: false });
  };

  const handleConfirmPublish = async () => {
    await togglePublish({ agentId: agentId, isPublished: true });
    setDialogOpen(false);
    toast.success('AI agent published', {
      icon: <CheckCircle className="text-emerald-500" size={18} />
    });
  };

  return (
    <div className="flex items-center gap-2">
      {/* Main Publish/Unpublish Button */}
      <Button
        variant={isPublished ? "destructive" : "default"}
        size="sm"
        onClick={handleTogglePublish}
        disabled={!agent?.config}
      >
        {isPublished ? (
          <>
            <CheckCircle className="mr-1" />
            Unpublish
          </>
        ) : (
          <>
            <Share2 className="mr-1" />
            Publish
          </>
        )}
      </Button>

      {/* Dialog with Code Snippet */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ExternalLink className="h-5 w-5" />
              API Snippet for &quot;{agentName}&quot;
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
                  {copied ? <CopyCheck className=" text-green-400" /> : <Copy />}
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleConfirmPublish}>
                <CheckCircle />
                Confirm & Publish
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};