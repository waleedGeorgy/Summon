'use client'
import { SubmitEvent, useState } from "react"
import { useMutation, useQuery } from "convex/react"
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { v4 as uuidv4 } from "uuid";
import { PlusCircleIcon, Loader2, CheckCircle } from "lucide-react"
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

const CreateAgentDialog = () => {
    const [agentDetails, setAgentDetails] = useState({ name: '', description: '' });
    const [isAgentCreating, setIsAgentCreating] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const { user } = useUser();
    const currentUser = useQuery(api.user.getUserById, { userId: user?.id ?? "skip" })

    const router = useRouter();

    const createNewAgentMutation = useMutation(api.agent.createNewAgent);

    const createNewMutation = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        setIsAgentCreating(true);

        const agentId = uuidv4();

        if (currentUser) await createNewAgentMutation({
            name: agentDetails.name,
            description: agentDetails.description,
            agentId: agentId,
            userId: currentUser?._id
        });

        setIsAgentCreating(false);
        setIsDialogOpen(false);

        toast.success("AI agent created successfully!", {
            icon: <CheckCircle className="text-emerald-500" size={20} />
        })

        router.push('/agent-builder/' + agentId);
    }

    return (
        <div className="flex flex-col justify-center items-center gap-1 mt-14">
            <h2 className="text-3xl">Create a new AI agent</h2>
            <p>Build your custom AI agent workflow</p>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger render={
                    <Button className='mt-3' onClick={() => setIsDialogOpen(true)}>
                        <PlusCircleIcon />
                        <span>Create</span>
                    </Button>
                } />
                <DialogContent>
                    <form onSubmit={createNewMutation}>
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
                                <Label htmlFor="agent-desc">Description</Label>
                                <Input
                                    id="agent-desc"
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
                            <Button type="submit" disabled={!agentDetails.name || isAgentCreating}>
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