import { useState, useTransition } from "react"
import { CheckCircle, Loader } from "lucide-react"
import type { CustomNode } from "@/convex/schema"
import { NodeSettingsDataProps } from "@/types"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup } from "@/components/ui/field"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

const IfElseNodeSettings = ({ selectedNode, saveFormData }: {
  selectedNode: CustomNode, saveFormData: (data: NodeSettingsDataProps) => void
}) => {
  const [ifElseConditions, setIfElseConditions] = useState({
    ifCondition: selectedNode.data.settings?.ifCondition || '',
    elseCondition: selectedNode.data.settings?.elseCondition || ''
  });

  const [isIfElseNodeSettingsSaving, startIfElseNodeSettingsSaving] = useTransition();

  const handleChange = (key: string, value: string) => {
    setIfElseConditions(prev => ({ ...prev, [key]: value }));
  }

  const saveIfElseNodeSetting = () => {
    startIfElseNodeSettingsSaving(() => {
      saveFormData(ifElseConditions);
    });
    toast.success('Settings saved', {
      icon: <CheckCircle className="text-emerald-500" size={18} />
    });
  }

  return (
    <div className="min-w-82 flex flex-col justify-center gap-4 px-5">
      <div>
        <h4 className="font-semibold text-center">If/Else</h4>
        <Separator className='mt-1' />
      </div>
      <FieldGroup className="gap-4">
        <Field>
          <Label htmlFor="if-condition">
            If condition
          </Label>
          <Input
            id="if-condition"
            type="text"
            value={ifElseConditions.ifCondition}
            onChange={(e) => handleChange('ifCondition', e.target.value)}
          />
        </Field>
        <Field>
          <Label htmlFor="else-condition">
            Else condition
          </Label>
          <Input
            id="else-condition"
            type="text"
            value={ifElseConditions.elseCondition}
            onChange={(e) => handleChange('elseCondition', e.target.value)}
          />
        </Field>
      </FieldGroup>
      <Button onClick={saveIfElseNodeSetting} disabled={isIfElseNodeSettingsSaving} className='mt-2'>
        {isIfElseNodeSettingsSaving ? <Loader className="animate-spin" /> : "Save"}
      </Button>
    </div>
  )
}

export default IfElseNodeSettings