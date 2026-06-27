'use client'
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { Template } from "@/convex/schema"
import { api } from "@/convex/_generated/api";
import { CheckCircle, icons, Loader2, LucideIcon, XCircle } from "lucide-react"
import {
    Card,
    CardAction,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { toast } from "sonner";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useActiveAgents } from "@/hooks/use-active-agents";

const tailwindColors: Record<string, string> = {
    "slate-500": "#64748b",
    "gray-500": "#6b7280",
    "zinc-500": "#71717a",
    "neutral-500": "#737373",
    "stone-500": "#78716c",
    "red-500": "#ef4444",
    "orange-500": "#f97316",
    "amber-500": "#f59e0b",
    "yellow-500": "#eab308",
    "lime-500": "#84cc16",
    "green-500": "#22c55e",
    "emerald-500": "#10b981",
    "teal-500": "#14b8a6",
    "cyan-500": "#06b6d4",
    "sky-500": "#0ea5e9",
    "blue-500": "#3b82f6",
    "indigo-500": "#6366f1",
    "violet-500": "#8b5cf6",
    "purple-500": "#a855f7",
    "fuchsia-500": "#d946ef",
    "pink-500": "#ec4899",
    "rose-500": "#f43f5e",
};

const TemplateCard = ({ template }: { template: Template }) => {
    const IconComponent = icons[template.icon as keyof typeof icons] as LucideIcon;
    const hexColor = tailwindColors[template.color] || "#64748b";

    const { user, isPaidUser } = useCurrentUser();

    const { remainingAgents } = useActiveAgents();

    const createWorkflowFromTemplate = useMutation(api.agent.createNewAgent);

    const router = useRouter();

    const [isCreatingWorkflow, startCreatingWorkflow] = useTransition();

    const onCreateFromTemplate = () => {
        startCreatingWorkflow(async () => {
            let agentURL;

            try {
                if (user) {
                    agentURL = await createWorkflowFromTemplate({
                        name: template.name,
                        description: template.description ?? '',
                        userId: user?._id,
                        nodes: template.nodes,
                        edges: template.edges
                    });
                };

                toast.success("Workflow created successfully!", {
                    icon: <CheckCircle className="text-emerald-500" size={18} />
                });

                router.push('/agent-builder/' + agentURL);
            } catch (error) {
                console.log("Error creating workflow: " + error);
                toast.error('Failed to create workflow', {
                    icon: <XCircle className="text-red-500" size={18} />
                });
            }
        })
    }

    return (
        <Card
            size="sm"
            className={`min-w-2xs cursor-pointer shadow hover:shadow-lg hover:-translate-y-1 dark:hover:brightness-125 transition duration-300 ${isCreatingWorkflow || (!isPaidUser && remainingAgents <= 0) ? 'opacity-60 pointer-events-none' : ''}`}
            style={{
                background: `linear-gradient(to bottom left, ${hexColor}4D, var(--card))`
            }}
            onClick={onCreateFromTemplate}
        >
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    {IconComponent &&
                        <span
                            className="size-8 p-1 rounded-lg"
                            style={{ backgroundColor: hexColor + '33' }}
                        >
                            <IconComponent className="size-full" style={{ color: hexColor }} />
                        </span>
                    }
                    <span className="text-lg">{template.name}</span>
                </CardTitle>
                <CardAction>
                    {isCreatingWorkflow &&
                        <Loader2 className="animate-spin" />
                    }
                </CardAction>
            </CardHeader>
            <CardContent className="line-clamp-2 leading-relaxed max-w-70">
                {template.description && template.description?.length > 0 ?
                    template.description
                    :
                    <span className="italic text-neutral-400">No description</span>
                }
            </CardContent>
        </Card>
    )
}

export default TemplateCard