'use client'
import { useQuery } from "convex/react"
import { NotepadText, Workflow } from "lucide-react"
import { api } from "@/convex/_generated/api"
import WorkflowTemplates from "./WorkflowTemplates"
import MyWorkflows from "./MyWorkflows"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useWorkflows } from "@/hooks/use-workflows"

const WorkflowsTabs = () => {
    const { workflows } = useWorkflows();

    const templates = useQuery(api.workflow.fetchAllTemplates);

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
                <MyWorkflows workflows={workflows ?? []} isLoading={!workflows} />
            </TabsContent>
            <TabsContent value='templates'><WorkflowTemplates templates={templates ?? []} isLoading={!templates} /></TabsContent>
        </Tabs>
    )
}

export default WorkflowsTabs