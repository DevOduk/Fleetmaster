import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createPublicClient } from "@/utils/supabase/server";
import jwt from "jsonwebtoken";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

const JWT_SECRET = process.env.JWT_SECRET;

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const limiter = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(60, "1 m"),
  analytics: false, // Turn off analytics to prevent extra async Redis calls
});

export async function GET(request: Request) {
  const startTime = Date.now();

  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("user_session");

    if (!sessionCookie) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(sessionCookie.value, JWT_SECRET!);
    } catch (err) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    // --- NON-BLOCKING BACKGROUND RATE LIMIT CHECK ---
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    limiter.limit(`rate_auth_${ip}`).then(({ success }) => {
      if (!success) console.warn(`Rate limit triggered for IP: ${ip}`);
    }).catch((e) => console.error("Rate limit check error:", e));

    const targetAccountType = decoded.accountType || decoded.role;
    const normalizedType =
      targetAccountType === "admin" || targetAccountType === "client"
        ? targetAccountType
        : "client";

    const cacheKey = `user:profile:${decoded.id}:${normalizedType}`;
    let userAccount: any = null;

    // 1. FAST REDIS LOOKUP
    try {
      const rawCachedUser = await redis.get(cacheKey);
      if (rawCachedUser) {
        userAccount = typeof rawCachedUser === "string" ? JSON.parse(rawCachedUser) : rawCachedUser;
      }
    } catch (redisError) {
      console.error("Redis session lookup failed, falling back to DB:", redisError);
    }

    // 2. CACHE MISS -> FAST SUPABASE LOOKUP
    if (!userAccount) {
      console.log(`[WARN ME]: CACHE MISS! Hitting Supabase for user: ${decoded.id}`);
      const supabase = createPublicClient();
      const tableName = normalizedType === "admin" ? "fleetmaster_admins" : "fleetmaster_clients";

      // Optimized query without heavy join (* nested queries)
      const { data, error } = await supabase
        .from(tableName)
        .select(`id, first_name, last_name, email, phone, created_at, city, verification_status, country, role, tenant_id, profile_pic, fleetmaster_tenants(*)`)
        .eq("id", decoded.id)
        .maybeSingle();

      if (error || !data) {
        return NextResponse.json({ error: "User profile no longer exists" }, { status: 404 });
      }

      userAccount = data;

      // Write back to Redis as stringified JSON to prevent type mismatch on retrieval
      redis.set(cacheKey, JSON.stringify(userAccount), { ex: 900 }).catch((e) =>
        console.error("Redis write failure:", e)
      );
    }

    console.log(`[TOTAL ME CODE RUNTIME]: ${Date.now() - startTime}ms`);

    return NextResponse.json(
      { user: userAccount },
      {
        status: 200,
        headers: {
          "Cache-Control": "private, max-age=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (err) {
    console.error("Session verification routing crash:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}