import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { Redis } from "@upstash/redis";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

export async function POST() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("user_session");

    // If a session cookie exists, decode it to invalidate the Redis profile cache securely
    if (sessionCookie?.value && redis) {
      try {
        const decoded: any = jwt.verify(sessionCookie.value, JWT_SECRET);
        if (decoded && decoded.id && decoded.accountType) {
          const cacheKey = `user:profile:${decoded.id}:${decoded.accountType}`;
          await redis.del(cacheKey);
        }
      } catch (jwtErr) {
        // Token might be expired or malformed; proceed safely with clearing cookies
        console.warn(
          "Non-blocking token decode failure during logout cache clearing:",
          jwtErr,
        );
      }
    }

    const response = NextResponse.json(
      { success: true, message: "Logged out successfully" },
      { status: 200 },
    );

    const isProd = process.env.NODE_ENV === "production";
    const cookieName = "user_session";

    // Target Option A: Domain-scoped cookie clear
    response.cookies.set({
      name: cookieName,
      value: "",
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      maxAge: 0,
      expires: new Date(0), // Extra assurance for older browsers
      path: "/",
      domain: isProd ? ".fleetmaster.com" : "localhost",
    });

    // Target Option B: Host-only fallback clear (Fixes standard localhost drops)
    response.cookies.set({
      name: cookieName,
      value: "",
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      maxAge: 0,
      expires: new Date(0),
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("Logout error exception:", err);
    return NextResponse.json(
      { error: "Internal Server Error during logout" },
      { status: 500 },
    );
  }
}
