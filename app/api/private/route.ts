import arcjet, { tokenBucket } from "@arcjet/next";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const arcjetKey = process.env.ARCJET_KEY;

if (!arcjetKey) {
  throw new Error("Missing ARCJET_KEY environment variable");
}

const aj = arcjet({
  key: arcjetKey,
  rules: [
    tokenBucket({
      mode: "LIVE",
      characteristics: ["userId"],
      refillRate: 5,
      interval: 10,
      capacity: 10,
    }),
  ],
});

export async function GET(req: Request) {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const decision = await aj.protect(req, { userId: user.id, requested: 1 });

  if (decision.isErrored()) {
    return NextResponse.json(
      { error: "Arcjet unavailable", reason: decision.reason },
      { status: 503 },
    );
  }

  if (decision.isDenied()) {
    return NextResponse.json(
      { error: "Too Many Requests", reason: decision.reason },
      { status: 429 },
    );
  }

  return NextResponse.json({
    ok: true,
    message: "Private endpoint is working",
    userId: user.id,
  });
}
