'use client'
import { useQuery } from "convex/react"
import { NotepadText, Workflow } from "lucide-react"
import { api } from "@/convex/_generated/api"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import MyAgents from "./MyAgents"
import AgentTemplates from "./AgentTemplates"
import { useActiveAgents } from "@/hooks/use-active-agents"

const AgentTabs = () => {
    const { agents } = useActiveAgents();

    const templates = useQuery(api.agent.fetchAllTemplates);

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
            <TabsContent value='templates'><AgentTemplates templates={templates ?? []} isLoading={!templates} /></TabsContent>
        </Tabs>
    )
}

export default AgentTabs