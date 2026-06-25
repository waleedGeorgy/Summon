import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
/**
 * A custom hook for the current user.
 *
 * @returns {user} the current convex user.
 * @returns {isLoading} the current loading state (true when either Clerk or user are not loaded)
 * @returns {isPaidUser} the current subscription status of the user ('free' | 'unlimited')
 */
export function useCurrentUser() {
  const { user, isLoaded: clerkLoaded } = useUser();

  const currentUser = useQuery(
    api.user.getUserById,
    user?.id ? { userId: user.id } : "skip",
  );

  return {
    user: currentUser,
    isLoading: !clerkLoaded || currentUser === undefined,
    isPaidUser: currentUser?.subscription === "unlimited",
  };
}
