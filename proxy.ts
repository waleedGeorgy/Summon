import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import arcjet, { shield } from "@arcjet/next";

const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    shield({
      mode: "LIVE",
    }),
  ],
});

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/agent-builder(.*)",
]);

const isPublicRoute = createRouteMatcher(["/"]);

export default clerkMiddleware(async (auth, req) => {
  const decision = await aj.protect(req);

  if (decision.isDenied() && decision.reason.isShield()) {
    return NextResponse.json(
      { error: "Request blocked due to suspicious activity" },
      { status: 403 },
    );
  }

  const { userId } = await auth();

  if (isPublicRoute(req) && userId) {
    const dashboardUrl = new URL("/dashboard/workflows", req.url);
    return NextResponse.redirect(dashboardUrl);
  }
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/(.*)",
  ],
};
