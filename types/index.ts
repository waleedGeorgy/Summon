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

export type CustomNodeSettings = CustomNode["data"];

export type generatedConfig = {
  startNode: string | null;
  flow:
    | {
        id: string;
        type: string;
        label: string;
        settings: {
          name?: string | undefined;
          includeHistory?: boolean | undefined;
          instructions?: string | undefined;
          model?: string | undefined;
          output?: string | undefined;
          schema?: string | undefined;
          ifCondition?: string | undefined;
          elseCondition?: string | undefined;
          whileCondition?: string | undefined;
          approvalTitle?: string | undefined;
          approvalMessage?: string | undefined;
          apiName?: string | undefined;
          apiUrl?: string | undefined;
          apiRequestMethod?: string | undefined;
          apiPostBody?: string | undefined;
          includeApiKey?: boolean | undefined;
          apiKey?: string | undefined;
        };
      }[]
    | undefined;
};
