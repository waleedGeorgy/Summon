import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle, FileJson2, Loader } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useState, useTransition } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CustomNode } from "@/convex/schema"
import { toast } from "sonner"

const MODELS = {
    'deepseek': 'DeepSeek-V3.2',
    'gemma': 'Google Gemma 4',
    'kimi': 'Kimi K2.5',
    'gemini': 'Gemini 3.5 Flash'
} as const;

export type AgentNodeSettingsDataProps = {
    name: string,
    instructions: string,
    includeHistory: boolean,
    model: string,
    output: string,
    schema: string
}
type AgentNodeSettingsProps = {
    selectedNode: CustomNode,
    updateAgentNodeSettings: (data: AgentNodeSettingsDataProps) => void
}

export const AgentNodeSettings = ({ selectedNode, updateAgentNodeSettings }: AgentNodeSettingsProps) => {
    const [agentSettingsData, setAgentSettingsData] = useState<AgentNodeSettingsDataProps>({
        name: selectedNode.data.settings?.name || '',
        instructions: selectedNode.data.settings?.instructions || '',
        includeHistory: selectedNode.data.settings?.includeHistory || true,
        model: selectedNode.data.settings?.model || '',
        output: selectedNode.data.settings?.output || 'text',
        schema: selectedNode.data.settings?.schema || '',
    });

    const [isAgentSettingsSaving, startAgentSettingsSaving] = useTransition();

    const handleChange = (key: string, value: string | boolean) => {
        setAgentSettingsData(prev => ({ ...prev, [key]: value }));
    }

    const saveAgentSetting = () => {
        startAgentSettingsSaving(() => {
            updateAgentNodeSettings(agentSettingsData);
        });
        toast.success('Settings saved', {
            icon: <CheckCircle className="text-emerald-500" size={18} />
        });
    }

    return (
        <ScrollArea className='h-117 px-4'>
            <div className="min-w-68 flex flex-col justify-center gap-3">
                <div>
                    <h4 className="font-semibold text-center">Agent Setting</h4>
                    <Separator className='mt-1' />
                </div>
                <FieldGroup className="gap-4">
                    <Field>
                        <Label htmlFor="agent-name">Agent name</Label>
                        <Input
                            id="agent-name"
                            name="name"
                            value={agentSettingsData?.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                        />
                    </Field>
                    <Field>
                        <Label htmlFor="agent-instructions">
                            Agent instructions
                        </Label>
                        <Textarea
                            id="agent-instructions"
                            name='instructions'
                            value={agentSettingsData?.instructions}
                            onChange={(e) => handleChange('instructions', e.target.value)}
                        />
                        <span className="flex items-center gap-2 text-sm">Add context <FileJson2 className="size-4" /></span>
                    </Field>
                </FieldGroup>
                <Separator />
                <div className="flex items-center justify-between gap-1">
                    <span className="text-sm">Include chat history</span>
                    <Switch onCheckedChange={(checked) => handleChange('includeHistory', checked)} checked={agentSettingsData?.includeHistory} />
                </div>
                <Separator />
                <div className="flex items-center justify-between gap-1">
                    <span className="text-sm">Model</span>
                    <Select
                        onValueChange={(value) => handleChange('model', value as string)}
                        value={agentSettingsData?.model}
                    >
                        <SelectTrigger className="w-full max-w-36 text-xs" size="sm">
                            <SelectValue placeholder="Select a model">
                                {agentSettingsData?.model ? MODELS[agentSettingsData.model as keyof typeof MODELS] : undefined}
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {Object.entries(MODELS).map(([value, label]) => (
                                    <SelectItem key={value} value={value} className='text-xs'>{label}</SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <Separator />
                <div className="flex flex-col justify-between gap-1">
                    <Tabs defaultValue="text" onValueChange={(value) => handleChange('output', value)} value={agentSettingsData?.output}>
                        <div className="flex items-center gap-1 justify-between">
                            <span className="text-sm">Output format</span>
                            <TabsList>
                                <TabsTrigger value="text" className='text-xs'>
                                    Text
                                </TabsTrigger>
                                <TabsTrigger value="json" className='text-xs'>
                                    JSON
                                </TabsTrigger>
                            </TabsList>
                        </div>
                        <TabsContent value='json'>
                            <span>JSON schema</span>
                            <Textarea className="mt-2" onChange={(e) => handleChange('schema', e.target.value)} value={agentSettingsData?.schema} />
                        </TabsContent>
                    </Tabs>
                </div>
                <Separator />
                <Button onClick={saveAgentSetting} disabled={isAgentSettingsSaving}>
                    {isAgentSettingsSaving ? <Loader className="animate-spin" /> : "Save"}
                </Button>
            </div>
        </ScrollArea>
    )
}