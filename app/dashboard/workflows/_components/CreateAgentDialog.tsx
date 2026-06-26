'use client'
import { SubmitEvent, useState, useTransition } from "react"
import { useMutation } from "convex/react"
import { useRouter } from "next/navigation";
import { PlusCircleIcon, Loader2, CheckCircle, XCircle } from "lucide-react"
import { api } from "@/convex/_generated/api"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useCurrentUser } from "@/hooks/use-current-user";
import { useActiveAgents } from "@/hooks/use-active-agents";

const CreateAgentDialog = () => {
    const [agentDetails, setAgentDetails] = useState({ name: '', description: '' });
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const [isAgentCreating, startCreatingAgent] = useTransition();

    const maxDescriptionChars = 80;

    const { user, isPaidUser } = useCurrentUser();

    const { remainingAgents } = useActiveAgents();

    const router = useRouter();

    const createNewAgentMutation = useMutation(api.agent.createNewAgent);

    const createNewAgent = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        startCreatingAgent(async () => {
            let agentURL;

            try {
                if (user) {
                    agentURL = await createNewAgentMutation({
                        name: agentDetails.name,
                        description: agentDetails.description,
                        userId: user?._id
                    });
                };
                setIsDialogOpen(false);

                toast.success("AI agent created successfully!", {
                    icon: <CheckCircle className="text-emerald-500" size={18} />
                });

                router.push('/agent-builder/' + agentURL);
            } catch (error) {
                console.log("Error creating agent: " + error);
                toast.error('Failed to create agent', {
                    icon: <XCircle className="text-red-500" size={18} />
                });
            }
        });
    }

    return (
        <div className="flex flex-col justify-center items-center gap-1 mt-14">
            <h2 className="text-3xl">Create a new workflow</h2>
            <p>Build and customize your custom AI workflow</p>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger render={
                    <Button className='mt-3' onClick={() => setIsDialogOpen(true)} disabled={!isPaidUser && ((remainingAgents ?? 0) <= 0)}>
                        <PlusCircleIcon />
                        <span>Create</span>
                    </Button>
                } />
                <DialogContent>
                    <form onSubmit={createNewAgent}>
                        <DialogHeader>
                            <DialogTitle className='text-xl'>Enter agent details</DialogTitle>
                            <DialogDescription>
                                Start off by naming your AI agent, and optionally giving it a brief description
                            </DialogDescription>
                        </DialogHeader>
                        <FieldGroup className="my-4">
                            <Field>
                                <Label htmlFor="agent-name">Name*</Label>
                                <Input
                                    id="agent-name"
                                    name="name"
                                    autoFocus
                                    onChange={e => setAgentDetails({ ...agentDetails, name: e.target.value })}
                                    disabled={isAgentCreating}
                                />
                            </Field>
                            <Field>
                                <Label htmlFor="agent-desc">
                                    Description
                                    <span className="text-sm text-muted-foreground ml-auto">
                                        {agentDetails.description.length}/{maxDescriptionChars}
                                    </span>
                                </Label>
                                <Input
                                    id="agent-desc"
                                    maxLength={80}
                                    name="desc"
                                    onChange={e => setAgentDetails({ ...agentDetails, description: e.target.value })}
                                    disabled={isAgentCreating}
                                />
                            </Field>
                        </FieldGroup>
                        <DialogFooter>
                            <DialogClose render={
                                <Button variant="outline" type="button">Cancel</Button>
                            } />
                            <Button type="submit" disabled={!agentDetails.name || isAgentCreating || (!isPaidUser && ((remainingAgents ?? 0) <= 0))}>
                                {isAgentCreating ? <Loader2 className="animate-spin" /> : "Create"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default CreateAgentDialog