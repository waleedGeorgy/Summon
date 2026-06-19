import { CustomNode } from "@/convex/schema";

export type NodeSettingsDataProps = {
  name?: string;
  instructions?: string;
  includeHistory?: boolean;
  model?: string;
  output?: string;
  schema?: string;
  ifCondition?: string;
  elseCondition?: string;
  whileCondition?: string;
  approvalTitle?: string;
  approvalMessage?: string;
  apiName?: string;
  apiRequestMethod?: string;
  apiPostBody?: string;
  apiUrl?: string;
  includeApiKey?: boolean;
  apiKey?: string;
};

export type CustomNodeSettings = CustomNode['data']
