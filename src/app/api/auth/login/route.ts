// src/app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { compare } from "bcrypt-ts";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

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
        let userAccount = null;

        const targetEmail = email.trim().toLowerCase();
        // Fallback to null if tenant is a blank string or undefined
        const targetTenantSlug = tenant && tenant.trim() ? tenant.trim().toLowerCase() : null;

        // 1. QUERY ADMIN ACCOUNTS
        if (role === "admin") {
            // Drop the strict inner join if we are on a flat domain without an active tenant context
            const queryBuilder = targetTenantSlug 
                ? supabase.from("fleetmaster_admins").select("*, fleetmaster_tenants!inner(*)").eq("fleetmaster_tenants.slug", targetTenantSlug)
                : supabase.from("fleetmaster_admins").select("*, fleetmaster_tenants(*)"); // Left join fallback

            const { data, error } = await queryBuilder
                .eq("email", targetEmail)
                .maybeSingle();

            if (error) throw error;
            userAccount = data;
        } 
        
        // 2. QUERY CLIENT ACCOUNTS
        else if (role === "client") {
            // Clients absolutely MUST have a tenant space. Prevent database crash by intercepting early.
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
        } 
        
        else {
            return NextResponse.json({ error: "Invalid role specified" }, { status: 400 });
        }

        // 3. Fail explicitly if no user matches filters
        if (!userAccount) {
            return NextResponse.json({ error: "Invalid credentials or unauthorized tenant access" }, { status: 401 });
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

        // Strip the raw password hash
        const { password: _, ...safeUserAccount } = userAccount;

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