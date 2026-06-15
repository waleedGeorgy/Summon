'use client'
import { useUser } from "@clerk/nextjs"
import { useQuery } from "convex/react"
import { NotepadText, HatGlasses } from "lucide-react"
import { api } from "@/convex/_generated/api"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import MyAgents from "./MyAgents"
import AgentTemplates from "./AgentTemplates"

const AgentTabs = () => {
    const { user } = useUser();

    const currentUser = useQuery(api.user.getUserById, { userId: user?.id ?? "skip" });

    const agents = useQuery(
        api.agent.fetchAllAgents,
        currentUser ? { createdBy: currentUser._id } : "skip"
    );

    return (
        <div>
            <Tabs defaultValue="my-agents">
                <TabsList className="mx-auto">
                    <TabsTrigger value="my-agents">
                        <HatGlasses />My Agents
                    </TabsTrigger>
                    <TabsTrigger value="templates">
                        <NotepadText />Templates
                    </TabsTrigger>
                </TabsList>
                <TabsContent value='my-agents' className='mx-auto md:px-5 px-12 py-4'>
                    <MyAgents agents={agents ?? []} isLoading={!agents} />
                </TabsContent>
                <TabsContent value='templates' className='mx-auto md:px-5 px-12 py-4'><AgentTemplates /></TabsContent>
            </Tabs>
        </div>
    )
}

export default AgentTabs