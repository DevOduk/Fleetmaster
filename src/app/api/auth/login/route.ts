// src/app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { compare } from "bcrypt-ts";
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

export async function POST(request: Request) {
    try {
        const { role, email, password, tenant } = await request.json();

        if (!role || !email || !password) {
            return NextResponse.json(
                { error: "Email and password identifiers are required" },
                { status: 400 }
            );
        }

        const supabase = await createClient();
        let userAccount: any = null;

        const targetEmail = email.trim().toLowerCase();
        const targetTenantSlug = tenant && tenant.trim() ? tenant.trim().toLowerCase() : null;

        // 1. QUERY ADMIN ACCOUNTS
        if (role === "admin") {
            const queryBuilder = targetTenantSlug
                ? supabase
                    .from("fleetmaster_admins")
                    .select("*, fleetmaster_tenants!inner(*)")
                    .eq("fleetmaster_tenants.slug", targetTenantSlug)
                : supabase.from("fleetmaster_admins").select("*, fleetmaster_tenants(*)");

            const { data, error } = await queryBuilder
                .eq("email", targetEmail)
                .maybeSingle();

            if (error) throw error;
            userAccount = data;
        }
        // 2. QUERY CLIENT ACCOUNTS
        else if (role === "client") {
            if (!targetTenantSlug) {
                return NextResponse.json(
                    { error: "A valid tenant workspace is required for client authentication." },
                    { status: 400 }
                );
            }

            const { data, error } = await supabase
                .from("fleetmaster_clients")
                .select("*, fleetmaster_tenants!inner(*)")
                .eq("email", targetEmail)
                .eq("fleetmaster_tenants.slug", targetTenantSlug)
                .maybeSingle();

            if (error) throw error;
            userAccount = data;
        } else {
            return NextResponse.json({ error: "Invalid role specified" }, { status: 400 });
        }

        // 3. Fail explicitly if no user matches filters
        if (!userAccount) {
            return NextResponse.json(
                { error: "Invalid credentials or unauthorized tenant access" },
                { status: 401 }
            );
        }

        // 4. Validate password hashes safely
        const isMatch = await compare(password, userAccount.password || "");
        if (!isMatch) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        // 5. Package state parameters into the JWT payload
        const tokenPayload = {
            id: userAccount.id,
            tenant_id: userAccount.tenant_id,
            email: userAccount.email,
            role: role === "admin" ? userAccount.role : "Client",
            accountType: role,
        };

        const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: "7d" });

        // Strip raw password hash before saving to cache or returning
        const { password: _, ...safeUserAccount } = userAccount;

        // 6. SEED REDIS CACHE (Eliminates cold cache miss on subsequent /api/auth/me)
        if (redis) {
            try {
                const normalizedType = role === "admin" ? "admin" : "client";
                const cacheKey = `user:profile:${safeUserAccount.id}:${normalizedType}`;

                // Cache user profile as stringified JSON for 15 minutes (900 seconds)
                await redis.set(cacheKey, JSON.stringify(safeUserAccount), { ex: 900 });
            } catch (cacheErr) {
                console.error("Non-blocking Redis login caching failure:", cacheErr);
            }
        }

        const response = NextResponse.json({ success: true, user: safeUserAccount }, { status: 200 });

        response.cookies.set({
            name: "user_session",
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: "/",
        });

        return response;
    } catch (err) {
        console.error("Login critical exception boundary:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}