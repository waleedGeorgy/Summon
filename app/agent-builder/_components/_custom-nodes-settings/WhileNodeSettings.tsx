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

const WhileNodeSettings = ({ selectedNode, saveFormData }: {
    selectedNode: CustomNode, saveFormData: (data: NodeSettingsDataProps) => void
}) => {
    const [whileCondition, setWhileCondition] = useState({
        whileCondition: selectedNode.data.settings?.whileCondition || ''
    });

    const [isWhileNodeSettingsSaving, startWhileNodeSettingsSaving] = useTransition();

    const saveWhileNodeSetting = () => {
        startWhileNodeSettingsSaving(() => {
            saveFormData(whileCondition);
        });
        toast.success('Settings saved', {
            icon: <CheckCircle className="text-emerald-500" size={18} />
        });
    }

    return (
        <div className="min-w-78 flex flex-col justify-center gap-3 px-4">
            <div>
                <h4 className="font-semibold text-center">While</h4>
                <Separator className='mt-1' />
            </div>
            <FieldGroup>
                <Field>
                    <Label htmlFor="while-condition">
                        While condition
                    </Label>
                    <Input
                        id="while-condition"
                        type="text"
                        value={whileCondition.whileCondition}
                        onChange={(e) => setWhileCondition({ whileCondition: e.target.value })}
                    />
                </Field>
            </FieldGroup>
            <Button onClick={saveWhileNodeSetting} disabled={isWhileNodeSettingsSaving} className='mt-2'>
                {isWhileNodeSettingsSaving ? <Loader className="animate-spin" /> : "Save"}
            </Button>
        </div>
    )
}

export default WhileNodeSettings