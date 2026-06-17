import { NodesContext } from "@/context/NodesContext";
import { useContext } from "react";
import { AgentNodeSettings } from "./NodeSettings";

const AgentSettingsPanel = () => {
  const context = useContext(NodesContext);
  if (!context) throw new Error("NodesContext must be used within a Provider");

  const { selectedNode } = context;

  return selectedNode && (
    <div className="bg-sidebar/80 backdrop-blur-lg py-3 flex flex-col gap-1 justify-center rounded-lg border">
      {selectedNode?.type === 'AgentNode' && <AgentNodeSettings selectedNode={selectedNode} />}
    </div>
  )
}

export default AgentSettingsPanel