// File: src/app/api/v1/auth/login/route.ts

import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { compare } from "bcrypt-ts";
import jwt from "jsonwebtoken";
import { Redis } from "@upstash/redis";
import { User } from "@/data/globalExports";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
    : null;

export async function POST(request: Request) {
  try {
    const { role, email, password, tenant } = await request.json();

    if (!role || !email || !password) {
      return NextResponse.json(
        { error: "Email and password identifiers are required" },
        { status: 400 },
      );
    }

    const supabase = await createClient();
    type AuthUser = Partial<User> & {
      password?: string | null;
      [key: string]: any;
    };

    let userAccount: AuthUser | null = null;
    const normalizedType = role === "Client" ? "client" : "admin";
    const targetEmail = email.trim().toLowerCase();
    const targetTenantSlug =
      tenant && tenant.trim() ? tenant.trim().toLowerCase() : null;
    const profileFields = `id, first_name, last_name, bio, email, phone, timezone, language, created_at, city, verification_status, country, role, tenant_id, profile_pic, postal_code, socials, is_otp, notify, newsletter, popup, dob${normalizedType === "client" ? ", national_id_number, dl_number, verification_error, submitted_document, onboarded" : ""
      }, fleetmaster_tenants!inner(*)`;
    const tableName =
      normalizedType === "admin"
        ? "fleetmaster_admins"
        : "fleetmaster_clients";
        
    // 1. QUERY ADMIN ACCOUNTS
    if (normalizedType === "admin") {
      const queryBuilder = targetTenantSlug
        ? supabase
          .from("fleetmaster_admins")
          .select(`password, ${profileFields}`)
          .eq("fleetmaster_tenants.slug", targetTenantSlug)
        : supabase
          .from("fleetmaster_admins")
          .select(`password, ${profileFields}`);

      const { data, error } = await queryBuilder
        .eq("email", targetEmail)
        .maybeSingle();

      if (error) throw error;

      userAccount = data;
    }
    // 2. QUERY CLIENT ACCOUNTS
    else if (normalizedType === "client") {
      if (!targetTenantSlug) {
        return NextResponse.json(
          {
            error:
              "A valid tenant workspace is required for client authentication.",
          },
          { status: 400 },
        );
      }

      const { data, error } = await supabase
        .from("fleetmaster_clients")
        .select(`password, ${profileFields}`)
        .eq("email", targetEmail)
        .eq("fleetmaster_tenants.slug", targetTenantSlug)
        .maybeSingle();

      if (error) throw error;
      userAccount = data;
    } else {
      return NextResponse.json(
        { error: "Invalid role specified" },
        { status: 400 },
      );
    }

    // 3. Fail explicitly if no user matches filters
    if (!userAccount) {
      return NextResponse.json(
        { error: "No user found with this email and tenant combination." },
        { status: 401 },
      );
    }

    // 4. Validate password hashes safely
    const isMatch = await compare(password, userAccount.password || "");
    if (!isMatch) {
      return NextResponse.json(
        { error: "You have entered an invalid password." },
        { status: 401 },
      );
    }

    // 5. Package state parameters into the JWT payload
    const tokenPayload = {
      id: userAccount.id,
      tenant_id: userAccount.tenant_id,
      email: userAccount.email,
      role: normalizedType === "admin" ? userAccount.role : "Client",
      accountType: normalizedType,
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: "7d" });

    // Strip raw password hash before saving to cache or returning
    const { password: _, ...safeUserAccount } = userAccount;

    // 6. SEED REDIS CACHE (Eliminates cold cache miss on subsequent /api/v1/auth/me)
    if (redis) {
      try {
        const cacheKey = `user:profile:${safeUserAccount.id}:${normalizedType}`;

        // Cache user profile as stringified JSON for 15 minutes (900 seconds)
        await redis.set(cacheKey, JSON.stringify(safeUserAccount), { ex: 900 });
      } catch (cacheErr) {
        console.error("Non-blocking Redis login caching failure:", cacheErr);
      }
    }

    const response = NextResponse.json(
      { success: true, user: safeUserAccount },
      { status: 200 },
    );

    if (userAccount.verification_status?.email) {
      response.cookies.set({
        name: "user_session",
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      });
    }

        // alter the profile returned by /me.
        if (userAccount) {
          void (async () => {
            try {
              const supabase = await createClient();
              const lastSeen = new Date().toISOString();
    
              const { error: lastSeenError } = await supabase
                .from(tableName)
                .update({ last_seen: lastSeen })
                .eq("id", userAccount.id);
    
              if (lastSeenError) {
                console.error("Failed to update user last_seen:", lastSeenError);
                return;
              }
    
              await Promise.all([
                redis.del(`tenant:clients:${userAccount.tenant_id}`),
              ]);
            } catch (backgroundError) {
              console.error("Background last_seen update failed:", backgroundError);
            }
          })();
        }

    return response;
  } catch (err: any) {
    console.error("Login critical exception boundary:", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
