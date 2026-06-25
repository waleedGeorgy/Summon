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

export type GeneratedConfig = {
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

export interface ClerkSubscriptionPlan {
  amount: number;
  currency: string;
  id: string;
  is_recurring: boolean;
  name: string;
  slug: string;
}

export interface ClerkSubscriptionItem {
  created_at: number;
  id: string;
  interval: string;
  is_free_trial: boolean;
  object: string;
  period_end: number | null;
  period_start: number;
  plan: ClerkSubscriptionPlan;
  plan_id: string;
  status: string;
  updated_at: number;
}

export interface ClerkSubscriptionPayer {
  email: string;
  first_name: string;
  id: string;
  image_url: string;
  last_name: string;
  organization_id: string;
  organization_name: string;
  user_id: string;
}

export interface ClerkSubscriptionData {
  active_at: number | null;
  canceled_at: number | null;
  created_at: number;
  ended_at: number | null;
  id: string;
  items: ClerkSubscriptionItem[];
  latest_payment_id: string | null;
  object: string;
  past_due_at: number | null;
  payer: ClerkSubscriptionPayer;
  payer_id: string;
  payment_source_id: string;
  status: string;
  updated_at: number;
}
