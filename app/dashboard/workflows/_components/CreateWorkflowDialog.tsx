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
import { useWorkflows } from "@/hooks/use-workflows";

const CreateWorkflowDialog = () => {
    const [workflowDetails, setWorkflowDetails] = useState({ name: '', description: '' });
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const [isWorkflowCreating, startCreatingWorkflow] = useTransition();

    const { user, isPaidUser } = useCurrentUser();

    const { remainingWorkflows } = useWorkflows();

    const router = useRouter();

    const createNewAgentMutation = useMutation(api.workflow.createNewWorkflow);

    const maxDescriptionChars = 80;

    const createNewAgent = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        startCreatingWorkflow(async () => {
            let agentURL;

            try {
                if (user) {
                    agentURL = await createNewAgentMutation({
                        name: workflowDetails.name,
                        description: workflowDetails.description,
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
                    <Button className='mt-3' onClick={() => setIsDialogOpen(true)} disabled={!isPaidUser && ((remainingWorkflows ?? 0) <= 0)}>
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
                                    onChange={e => setWorkflowDetails({ ...workflowDetails, name: e.target.value })}
                                    disabled={isWorkflowCreating}
                                />
                            </Field>
                            <Field>
                                <Label htmlFor="agent-desc">
                                    Description
                                    <span className="text-sm text-muted-foreground ml-auto">
                                        {workflowDetails.description.length}/{maxDescriptionChars}
                                    </span>
                                </Label>
                                <Input
                                    id="agent-desc"
                                    maxLength={80}
                                    name="desc"
                                    onChange={e => setWorkflowDetails({ ...workflowDetails, description: e.target.value })}
                                    disabled={isWorkflowCreating}
                                />
                            </Field>
                        </FieldGroup>
                        <DialogFooter>
                            <DialogClose render={
                                <Button variant="outline" type="button">Cancel</Button>
                            } />
                            <Button type="submit" disabled={!workflowDetails.name || isWorkflowCreating || (!isPaidUser && ((remainingWorkflows ?? 0) <= 0))}>
                                {isWorkflowCreating ? <Loader2 className="animate-spin" /> : "Create"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default CreateWorkflowDialog