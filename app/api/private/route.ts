import arcjet, { tokenBucket } from "@arcjet/next";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const arcjetKey = process.env.ARCJET_KEY;

const aj = arcjetKey
  ? arcjet({
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
    })
  : null;

function privateJson(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "private, no-store, max-age=0",
    },
  });
}

export async function GET(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return privateJson({ error: "Unauthorized" }, 401);
  }

  if (!aj) {
    return privateJson({ error: "Protection service unavailable" }, 503);
  }

  const decision = await aj.protect(req, { userId, requested: 1 });

  if (decision.isErrored()) {
    return privateJson({ error: "Protection service unavailable" }, 503);
  }

  if (decision.isDenied()) {
    return privateJson({ error: "Too Many Requests" }, 429);
  }

  return privateJson({
    ok: true,
    message: "Private endpoint is working",
    userId,
  });
}
