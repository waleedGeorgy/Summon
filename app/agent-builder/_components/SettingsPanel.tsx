import { useContext } from "react";
import { NodesContext } from "@/context/NodesContext";
import { CustomNode } from "@/convex/schema";
import { AgentNodeSettings, AgentNodeSettingsDataProps } from "./AgentNodeSettings";

const SettingsPanel = () => {
  const context = useContext(NodesContext);
  if (!context) throw new Error("NodesContext must be used within a Provider");

  const { selectedNode, setNodes } = context;

  const onUpdateAgentSettings = (settingsData: AgentNodeSettingsDataProps) => {
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
          selectedNode={selectedNode}
          updateAgentNodeSettings={(settings: AgentNodeSettingsDataProps) => {
            onUpdateAgentSettings(settings)
          }}
        />
      }
    </div>
  )
}

export default SettingsPanel