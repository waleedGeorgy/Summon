import { WebhookEvent } from "@clerk/nextjs/server";
import { Webhook } from "svix";
import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, svix-id, svix-timestamp, svix-signature",
};

http.route({
  path: "/clerk-webhook",
  method: "OPTIONS",
  handler: httpAction(async () => {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }),
});

http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const whSecret = process.env.CLERK_WEBHOOK_SECRET;
    if (!whSecret) throw new Error("A webhook secret was not provided");

    const svix_id = request.headers.get("svix-id");
    const svix_signature = request.headers.get("svix-signature");
    const svix_timestamp = request.headers.get("svix-timestamp");

    if (!svix_id || !svix_signature || !svix_timestamp) {
      return new Response("Error. No SVIX headers", {
        status: 400,
        headers: corsHeaders,
      });
    }

    const payload = await request.json();
    const body = JSON.stringify(payload);

    const wh = new Webhook(whSecret);
    let event: WebhookEvent;

    try {
      event = wh.verify(body, {
        "svix-id": svix_id,
        "svix-signature": svix_signature,
        "svix-timestamp": svix_timestamp,
      }) as WebhookEvent;
    } catch (error) {
      console.log("Error verifying the webhook", error);
      return new Response("An error occurred", {
        status: 400,
        headers: corsHeaders,
      });
    }

    const eventType = event.type;
    if (eventType === "user.created" || eventType === "user.updated") {
      const { id, email_addresses, first_name, last_name } = event.data;
      const email = email_addresses[0].email_address;
      const name = `${first_name || ""} ${last_name || ""}`.trim();

      try {
        await ctx.runMutation(api.user.createNewUser, {
          userId: id,
          email,
          name,
        });
      } catch (error) {
        console.log("Error creating a user", error);
        return new Response("Error creating user", {
          status: 500,
          headers: corsHeaders,
        });
      }
    } else if (eventType === "user.deleted") {
      const { id } = event.data;

      try {
        if (id) {
          await ctx.runMutation(api.user.deleteUser, {
            userId: id,
          });
        }
      } catch (error) {
        console.log("Error deleting user", error);
        return new Response("Error deleting user", {
          status: 500,
          headers: corsHeaders,
        });
      }
    }

    return new Response("Webhook processed successfully", {
      status: 200,
      headers: corsHeaders,
    });
  }),
});

export default http;
