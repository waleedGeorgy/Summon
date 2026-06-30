import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { api } from "@/convex/_generated/api"
import { Workflow } from "@/convex/schema"
import { useMutation } from "convex/react"
import { CheckCircle, Edit, Loader2, XCircle } from "lucide-react"
import { SubmitEvent, useState, useTransition } from "react"
import { toast } from "sonner"

const EditWorkflowButton = ({ workflow }: { workflow: Workflow }) => {
    const [workflowDetails, setWorkflowDetails] = useState({ name: workflow.name, description: workflow.description });
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const maxDescriptionChars = 80;

    const [isWorkflowUpdating, startWorkflowUpdating] = useTransition();

    const updateWorkflowDetails = useMutation(api.workflow.updateWorkflowNameAndDescription);

    const onWorkflowFormSubmit = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        startWorkflowUpdating(async () => {
            try {
                await updateWorkflowDetails({
                    workflowId: workflow._id,
                    name: workflowDetails.name,
                    description: workflowDetails.description
                });
                setIsDialogOpen(false);

                toast.success("Workflow updated successfully!", {
                    icon: <CheckCircle className="text-emerald-500" size={18} />
                });
            } catch (error) {
                console.log("Error updating workflow: " + error);
                toast.error('Failed to update workflow', {
                    icon: <XCircle className="text-red-500" size={18} />
                });
            }
        });
    }

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger render={
                <Button size='sm' className='ml-1' variant='outline' onClick={() => setIsDialogOpen(true)} disabled={isWorkflowUpdating}>
                    <Edit />
                    <span className='hidden lg:inline'>Edit</span>
                </Button>
            } />
            <DialogContent>
                <form onSubmit={onWorkflowFormSubmit}>
                    <DialogHeader>
                        <DialogTitle className='text-xl'>Edit workflow details</DialogTitle>
                    </DialogHeader>
                    <FieldGroup className="my-4">
                        <Field>
                            <Label htmlFor="agent-name">Name*</Label>
                            <Input
                                id="agent-name"
                                name="name"
                                autoFocus
                                onChange={e => setWorkflowDetails({ ...workflowDetails, name: e.target.value })}
                                value={workflowDetails.name}
                            />
                        </Field>
                        <Field>
                            <Label htmlFor="agent-desc">
                                Description
                                <span className="text-sm text-muted-foreground ml-auto">
                                    {workflowDetails.description?.length || 0}/{maxDescriptionChars}
                                </span>
                            </Label>
                            <Input
                                id="agent-desc"
                                maxLength={80}
                                name="desc"
                                onChange={e => setWorkflowDetails({ ...workflowDetails, description: e.target.value })}
                                value={workflowDetails.description}
                            />
                        </Field>
                    </FieldGroup>
                    <DialogFooter>
                        <DialogClose render={
                            <Button variant="outline" type="button">Cancel</Button>
                        } />
                        <Button type="submit" disabled={!workflowDetails.name || isWorkflowUpdating}>
                            {isWorkflowUpdating ? <Loader2 className="animate-spin" /> : "Edit"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default EditWorkflowButton