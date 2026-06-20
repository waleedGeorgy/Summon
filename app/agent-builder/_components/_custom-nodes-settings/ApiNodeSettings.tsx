import { useState, useTransition } from "react";
import { NodeSettingsDataProps } from "@/types";
import { Button } from "@/components/ui/button";
import { FieldGroup, Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { CustomNode } from "@/convex/schema"
import { CheckCircle, Eye, EyeOff, Loader } from "lucide-react";
import { toast } from "sonner";

export const ApiNodeSettings = ({ selectedNode, saveFormData }: {
    selectedNode: CustomNode,
    saveFormData: (data: NodeSettingsDataProps) => void
}) => {
    const [apiSettingsData, setApiSettingsData] = useState<NodeSettingsDataProps>({
        apiName: selectedNode.data.settings?.apiName || '',
        apiUrl: selectedNode.data.settings?.apiUrl || '',
        apiPostBody: selectedNode.data.settings?.apiPostBody || '',
        apiRequestMethod: selectedNode.data.settings?.apiRequestMethod || 'get',
        includeApiKey: selectedNode.data.settings?.includeApiKey || false,
        apiKey: selectedNode.data.settings?.apiKey || '',
    });

    const [showApi, setShowApi] = useState(false);

    const [isApiSettingsSaving, startApiSettingsSaving] = useTransition();

    const handleChange = (key: string, value: string | boolean) => {
        setApiSettingsData(prev => ({ ...prev, [key]: value }));
    }

    const saveApiNodeSetting = () => {
        startApiSettingsSaving(() => {
            saveFormData(apiSettingsData);
        });
        toast.success('Settings saved', {
            icon: <CheckCircle className="text-emerald-500" size={18} />
        });
    }

    return (
        <ScrollArea className='h-86 px-2'>
            <div className="min-w-72 flex flex-col justify-center gap-4 mx-3">
                <div>
                    <h4 className="font-semibold text-center">{selectedNode.data.settings?.apiName ? selectedNode.data.settings?.apiName : "API"}</h4>
                    <Separator className='mt-1' />
                </div>
                <FieldGroup className="gap-4">
                    <Field>
                        <Label htmlFor="api-name">API name</Label>
                        <Input
                            id="api-name"
                            name="apiName"
                            value={apiSettingsData?.apiName}
                            onChange={(e) => handleChange('apiName', e.target.value)}
                        />
                    </Field>
                    <Field>
                        <Label htmlFor="api-url">
                            API URL
                        </Label>
                        <Input
                            id="api-url"
                            name='apiUrl'
                            value={apiSettingsData?.apiUrl}
                            onChange={(e) => handleChange('apiUrl', e.target.value)}
                        />
                    </Field>
                </FieldGroup>
                <div className="flex flex-col justify-between gap-1">
                    <Tabs defaultValue="text" onValueChange={(value) => handleChange('apiRequestMethod', value)} value={apiSettingsData?.apiRequestMethod}>
                        <div className="flex items-center gap-1 justify-between">
                            <span className="text-sm">Output format</span>
                            <TabsList>
                                <TabsTrigger value="get" className='text-xs'>
                                    GET
                                </TabsTrigger>
                                <TabsTrigger value="post" className='text-xs'>
                                    POST
                                </TabsTrigger>
                            </TabsList>
                        </div>
                        <TabsContent value='post'>
                            <span>POST parameters</span>
                            <Textarea
                                className="mt-2"
                                placeholder='{"param1: "value1"}'
                                onChange={(e) => handleChange('apiPostBody', e.target.value)}
                                value={apiSettingsData?.apiPostBody}
                            />
                        </TabsContent>
                    </Tabs>
                </div>
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between gap-1">
                        <span className="text-sm">Include API key</span>
                        <Switch onCheckedChange={(checked) => handleChange('includeApiKey', checked)} checked={apiSettingsData?.includeApiKey} />
                    </div>
                    {apiSettingsData?.includeApiKey &&
                        <>
                            <Field>
                                <Label htmlFor="api-key">
                                    API key
                                </Label>
                                <InputGroup>
                                    <InputGroupInput
                                        type={showApi ? "text" : "password"}
                                        id="api-key"
                                        name='apiKey'
                                        value={apiSettingsData?.apiKey}
                                        onChange={(e) => handleChange('apiKey', e.target.value)}
                                    />
                                    <InputGroupAddon align="inline-end">
                                        {showApi ?
                                            <EyeOff className="size-4 cursor-pointer" aria-hidden="true" onClick={() => setShowApi((prev) => !prev)} />
                                            :
                                            <Eye className="size-4 cursor-pointer" aria-hidden="true" onClick={() => setShowApi((prev) => !prev)} />
                                        }
                                        <span className="sr-only">
                                            {showApi ? "Hide password" : "Show password"}
                                        </span>
                                    </InputGroupAddon>
                                </InputGroup>
                            </Field>

                        </>
                    }
                </div>
                <Button onClick={saveApiNodeSetting} disabled={isApiSettingsSaving} className='mt-2'>
                    {isApiSettingsSaving ? <Loader className="animate-spin" /> : "Save"}
                </Button>
            </div>
        </ScrollArea>
    )
}

export default ApiNodeSettings