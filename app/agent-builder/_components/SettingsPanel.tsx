import { useContext } from "react";
import { NodesContext } from "@/context/NodesContext";
import { CustomNode } from "@/convex/schema";
import { AgentNodeSettings, NodeSettingsDataProps } from "./_custom-nodes-settings/AgentNodeSettings";
import EndNodeSettings from "./_custom-nodes-settings/EndNodeSettings";

const SettingsPanel = () => {
  const context = useContext(NodesContext);
  if (!context) throw new Error("NodesContext must be used within a Provider");

  const { selectedNode, setNodes } = context;

  const updateNodeData = (settingsData: NodeSettingsDataProps) => {
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
            updateNodeData(settings)
          }}
        />
      }
      {selectedNode?.type === 'EndNode' &&
        <EndNodeSettings
          key={selectedNode.id}
          selectedNode={selectedNode}
          saveFormData={(settings: NodeSettingsDataProps) => {
            updateNodeData(settings)
          }}
        />
      }
    </div>
  )
}

export default SettingsPanel