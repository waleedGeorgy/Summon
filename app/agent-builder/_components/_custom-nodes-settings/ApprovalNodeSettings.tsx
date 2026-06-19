import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup } from "@/components/ui/field"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import type { CustomNode } from "@/convex/schema"
import { toast } from "sonner"
import { CheckCircle, Loader } from "lucide-react"
import { Input } from "@/components/ui/input"
import { NodeSettingsDataProps } from "@/types"
import { Textarea } from "@/components/ui/textarea"

const ApprovalNodeSettings = ({ selectedNode, saveFormData }: {
    selectedNode: CustomNode, saveFormData: (data: NodeSettingsDataProps) => void
}) => {
    const [approvalData, setApprovalData] = useState({
        approvalTitle: selectedNode.data.settings?.approvalTitle || '',
        approvalMessage: selectedNode.data.settings?.approvalMessage || ''
    });

    const [isApprovalNodeSettingsSaving, startApprovalNodeSettingsSaving] = useTransition();

    const handleChange = (key: string, value: string) => {
        setApprovalData(prev => ({ ...prev, [key]: value }));
    }

    const saveIfElseNodeSetting = () => {
        startApprovalNodeSettingsSaving(() => {
            saveFormData(approvalData);
        });
        toast.success('Settings saved', {
            icon: <CheckCircle className="text-emerald-500" size={18} />
        });
    }

    return (
        <div className="min-w-78 flex flex-col justify-center gap-3 px-4">
            <div>
                <h4 className="font-semibold text-center">User approval</h4>
                <Separator className='mt-1' />
            </div>
            <FieldGroup className="gap-4">
                <Field>
                    <Label htmlFor="approval-title">
                        Approval title
                    </Label>
                    <Input
                        id="approval-title"
                        type="text"
                        value={approvalData.approvalTitle}
                        onChange={(e) => handleChange('approvalTitle', e.target.value)}
                    />
                </Field>
                <Field>
                    <Label htmlFor="approval-message">
                        Approval message
                    </Label>
                    <Textarea
                        id="approval-message"
                        value={approvalData.approvalMessage}
                        onChange={(e) => handleChange('approvalMessage', e.target.value)}
                    />
                </Field>
            </FieldGroup>
            <Button onClick={saveIfElseNodeSetting} disabled={isApprovalNodeSettingsSaving} className='mt-2'>
                {isApprovalNodeSettingsSaving ? <Loader className="animate-spin" /> : "Save"}
            </Button>
        </div>
    )
}

export default ApprovalNodeSettings