import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useCurrentUser } from "./use-current-user";

export function useActiveAgents() {
  const { user } = useCurrentUser();

  const agents = useQuery(
    api.agent.fetchAllAgents,
    user ? { createdBy: user._id } : "skip",
  );

  const activeAgents =
    agents?.reduce(
      (count, agent) => count + (agent.status === "active" ? 1 : 0),
      0,
    ) ?? 0;

  const remainingAgents = 2 - activeAgents;

  return {
    agents,
    activeAgents,
    remainingAgents,
  };
}
