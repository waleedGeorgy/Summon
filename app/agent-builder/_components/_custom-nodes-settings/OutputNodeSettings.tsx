import { useState, useTransition } from "react"
import { CheckCircle, Loader } from "lucide-react"
import type { CustomNode } from "@/convex/schema"
import { NodeSettingsDataProps } from "@/types"
import { Button } from "@/components/ui/button"
import { Field } from "@/components/ui/field"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

const OutputNodeSettings = ({ selectedNode, saveFormData }: {
    selectedNode: CustomNode, saveFormData: (data: NodeSettingsDataProps) => void
}) => {
    const [workflowOutput, setWorkflowOutput] = useState({ schema: selectedNode.data.settings?.schema || '' });

    const [isEndNodeSettingsSaving, startEndNodeSettingsSaving] = useTransition();

    const saveEndNodeSetting = () => {
        startEndNodeSettingsSaving(() => {
            saveFormData(workflowOutput);
        });
        toast.success('Settings saved', {
            icon: <CheckCircle className="text-emerald-500" size={18} />
        });
    }

    return (
        <div className="min-w-82 flex flex-col justify-center gap-4 px-5">
            <div>
                <h4 className="font-semibold text-center">Output</h4>
                <Separator className='mt-1' />
            </div>
            <div>
                <Field>
                    <Label htmlFor="output">
                        Workflow output
                    </Label>
                    <Textarea
                        id="output"
                        name='output'
                        rows={10}
                        value={workflowOutput.schema}
                        onChange={(e) => setWorkflowOutput({ schema: e.target.value })}
                    />
                </Field>
            </div>
            <Button onClick={saveEndNodeSetting} disabled={isEndNodeSettingsSaving} className='mt-2'>
                {isEndNodeSettingsSaving ? <Loader className="animate-spin" /> : "Save"}
            </Button>
        </div>
    )
}

export default OutputNodeSettings