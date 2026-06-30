import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useCurrentUser } from "./use-current-user";

export function useWorkflows() {
  const { user } = useCurrentUser();

  const workflows = useQuery(
    api.workflow.fetchAllWorkflows,
    user ? { createdBy: user._id } : "skip",
  );

  const activeWorkflows =
    workflows?.reduce(
      (count, agent) => count + (agent.status === "active" ? 1 : 0),
      0,
    ) ?? 0;

  const remainingWorkflows = 2 - activeWorkflows;

  return {
    workflows,
    activeWorkflows,
    remainingWorkflows,
  };
}
