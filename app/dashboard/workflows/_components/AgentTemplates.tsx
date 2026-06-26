import { Template } from "@/convex/schema"
import TemplateCard from "../../_components/TemplateCard"

const AgentTemplates = ({ templates, isLoading }: { templates: Template[], isLoading: boolean }) => {
    return (
        <div className="flex flex-wrap gap-4 md:px-12 px-6 py-4">
            {isLoading ?
                [...Array(4)].map((_, id) => (
                    <div className="w-72 h-33 dark:bg-sidebar bg-neutral-400 animate-pulse rounded-xl" key={id} />
                ))
                : templates && templates.length > 0 ?
                    templates.map(template => (
                        <TemplateCard key={template._id} template={template} />
                    ))
                    :
                    <p className="text-muted-foreground">No templates found</p>
            }
        </div>
    )
}

export default AgentTemplates