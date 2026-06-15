import arcjet, { tokenBucket } from "@arcjet/next";

export const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    tokenBucket({
      mode: "LIVE",
      characteristics: ["userId"],
      refillRate: 5000,
      interval: 60 * 60 * 24 * 30 * 1000,
      capacity: 5000,
    }),
  ],
});
