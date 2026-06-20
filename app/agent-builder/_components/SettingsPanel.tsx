import { useContext } from "react";
import { NodesContext } from "@/context/NodesContext";
import { CustomNode } from "@/convex/schema";
import { NodeSettingsDataProps } from "@/types";
import { AgentNodeSettings } from "./_custom-nodes-settings/AgentNodeSettings";
import OutputNodeSettings from "./_custom-nodes-settings/OutputNodeSettings";
import IfElseNodeSettings from "./_custom-nodes-settings/IfElseNodeSettings";
import WhileNodeSettings from "./_custom-nodes-settings/WhileNodeSettings";
import ApprovalNodeSettings from "./_custom-nodes-settings/ApprovalNodeSettings";
import ApiNodeSettings from "./_custom-nodes-settings/ApiNodeSettings";

const SettingsPanel = () => {
  const context = useContext(NodesContext);
  if (!context) throw new Error("NodesContext must be used within a Provider");

  const { selectedNode, setNodes } = context;

  const updateNodeSettingsData = (settingsData: NodeSettingsDataProps) => {
    if (!selectedNode) return;

    setNodes((prevNodes: CustomNode[]) =>
      prevNodes.map((node: CustomNode) => {
        if (node.id === selectedNode.id) {
          return {
            ...node,
            data: {
              ...node.data,
              settings: settingsData
            }
          };
        }
        return node;
      })
    );
  }

  return selectedNode && (
    <div className="bg-sidebar/80 backdrop-blur-lg py-3 flex flex-col gap-1 justify-center rounded-lg border">
      {selectedNode?.type === 'AgentNode' &&
        <AgentNodeSettings
          key={selectedNode.id}
          selectedNode={selectedNode}
          saveFormData={(settings: NodeSettingsDataProps) => {
            updateNodeSettingsData(settings)
          }}
        />
      }
      {selectedNode?.type === 'OutputNode' &&
        <OutputNodeSettings
          key={selectedNode.id}
          selectedNode={selectedNode}
          saveFormData={(settings: NodeSettingsDataProps) => {
            updateNodeSettingsData(settings)
          }}
        />
      }
      {selectedNode?.type === 'IfElseNode' &&
        <IfElseNodeSettings
          key={selectedNode.id}
          selectedNode={selectedNode}
          saveFormData={(settings: NodeSettingsDataProps) => {
            updateNodeSettingsData(settings)
          }}
        />
      }
      {selectedNode?.type === 'WhileNode' &&
        <WhileNodeSettings
          key={selectedNode.id}
          selectedNode={selectedNode}
          saveFormData={(settings: NodeSettingsDataProps) => {
            updateNodeSettingsData(settings)
          }}
        />
      }
      {selectedNode?.type === 'ApprovalNode' &&
        <ApprovalNodeSettings
          key={selectedNode.id}
          selectedNode={selectedNode}
          saveFormData={(settings: NodeSettingsDataProps) => {
            updateNodeSettingsData(settings)
          }}
        />
      }
      {selectedNode?.type === 'ApiNode' &&
        <ApiNodeSettings
          key={selectedNode.id}
          selectedNode={selectedNode}
          saveFormData={(settings: NodeSettingsDataProps) => {
            updateNodeSettingsData(settings)
          }}
        />
      }
    </div>
  )
}

export default SettingsPanel