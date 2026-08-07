// Server Component (No "use client" directive)
import React from "react";
import { cookies } from "next/headers";
import { Redis } from "@upstash/redis";
import jwt from "jsonwebtoken";
import TenantManagerClientLayout from "./layout-client";

const JWT_SECRET = process.env.JWT_SECRET;
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
});

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("user_session");
  let serverUser = null;

  if (sessionCookie?.value && JWT_SECRET) {
    try {
      const decoded = jwt.verify(sessionCookie.value, JWT_SECRET) as {
        id?: string;
        accountType?: string;
        role?: string;
      };

      if (decoded?.id) {
        const targetAccountType = decoded.accountType || decoded.role;
        const normalizedType =
          targetAccountType === "admin" || targetAccountType === "client"
            ? targetAccountType
            : "client";

        const cacheKey = `user:profile:${decoded.id}:${normalizedType}`;
        const cachedProfile = await redis.get(cacheKey);

        if (cachedProfile) {
          serverUser =
            typeof cachedProfile === "string"
              ? JSON.parse(cachedProfile)
              : cachedProfile;
        }
      }
    } catch (e) {
      console.warn(
        "Server layout profile pre-fetch skip or invalid token signature:",
        e
      );
    }
  }

  return (
    <TenantManagerClientLayout serverUser={serverUser}>
      {children}
    </TenantManagerClientLayout>
  );
}