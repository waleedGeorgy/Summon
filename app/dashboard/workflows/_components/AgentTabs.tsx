'use client'
import { useQuery } from "convex/react"
import { NotepadText, Workflow } from "lucide-react"
import { api } from "@/convex/_generated/api"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import MyAgents from "./MyAgents"
import AgentTemplates from "./AgentTemplates"
import { useCurrentUser } from "@/hooks/use-current-user"

const AgentTabs = () => {
    const { user } = useCurrentUser();

    const agents = useQuery(
        api.agent.fetchAllAgents,
        user ? { createdBy: user._id } : "skip"
    );

    return (
        <Tabs defaultValue="my-agents">
            <TabsList className="mx-auto">
                <TabsTrigger value="my-agents">
                    <Workflow />My workflows
                </TabsTrigger>
                <TabsTrigger value="templates">
                    <NotepadText />Templates
                </TabsTrigger>
            </TabsList>
            <TabsContent value='my-agents'>
                <MyAgents agents={agents ?? []} isLoading={!agents} />
            </TabsContent>
            <TabsContent value='templates'><AgentTemplates /></TabsContent>
        </Tabs>
    )
}

export default AgentTabs