import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createPublicClient } from "@/utils/supabase/server";
import jwt from "jsonwebtoken";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

const JWT_SECRET = process.env.JWT_SECRET;

// 1. Initialize Upstash Redis
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// 2. Configure a defensive rate limiter (e.g., 60 requests per minute per user/IP)
const limiter = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(60, "1 m"),
  analytics: true,
});

export async function GET(request: Request) {
    const startTime = Date.now();

  // --- RATE LIMIT SECURITY LAYER ---
  // Get IP for rate-limiting guests, or fallback safely
  const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
  const { success: limitOk } = await limiter.limit(`rate_auth_${ip}`);
  
  if (!limitOk) {
    return NextResponse.json(
      { error: "Too many authentication check requests. Slow down." },
      { status: 429 }
    );
  }

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

    const targetAccountType = decoded.accountType || decoded.role;
    const normalizedType =
      targetAccountType === "admin" || targetAccountType === "client"
        ? targetAccountType
        : "client";

    // 3. HIGH SPEED REDIS FETCH
    const cacheKey = `user:profile:${decoded.id}:${normalizedType}`;
    let userAccount: any = null;
  console.log(`[DEBUG ME]: Checking key -> ${cacheKey}`);

    try {
          const t0 = Date.now();

      userAccount = await redis.get(cacheKey);
          console.log(`[PERF ME]: Redis look up took -> ${Date.now() - t0}ms`);

    } catch (redisError) {
      console.error("Redis session lookup failed, falling back to DB:", redisError);
    }

    // 4. CACHE MISS -> QUERY SUPABASE
    if (!userAccount) {

    console.log(`[WARN ME]: CACHE MISS! Hitting Supabase for user: ${decoded.id}`);
    const t1 = Date.now();

      const supabase = createPublicClient();
      const tableName = normalizedType === "admin" ? "fleetmaster_admins" : "fleetmaster_clients";

      const { data, error } = await supabase
        .from(tableName)
        .select(
          "id, first_name, last_name, email, phone, created_at, city, verification_status, country, role, tenant_id, postal_code, timezone, language, profile_pic, fleetmaster_tenants(*)"
        )
        .eq("id", decoded.id)
        .maybeSingle();
    console.log(`[PERF ME]: Supabase query took -> ${Date.now() - t1}ms`);
    
      if (error || !data) {
        return NextResponse.json({ error: "User profile no longer exists" }, { status: 404 });
      }

      userAccount = data;

      // 5. CACHE HIT -> WRITE TO REDIS (Keep active for 15 minutes)
      try {
        await redis.set(cacheKey, userAccount, { ex: 900 });
      } catch (redisError) {
        console.error("Redis write failure:", redisError);
      }
    }
 console.log(`[TOTAL ME CODE RUNTIME]: ${Date.now() - startTime}ms`);
    return NextResponse.json(
      { user: userAccount },
      {
        status: 200,
        headers: {
          // Tell the browser to hold onto this context for 60 seconds to save network bandwidth
          "Cache-Control": "private, max-age=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (err) {
    console.error("Session verification routing crash:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
