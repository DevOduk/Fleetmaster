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
                { error: "Email, and password identifiers are required" },
                { status: 400 }
            );
        }

        const supabase = await createClient();
        let userAccount = null;

        // Clean up text parameters to avoid casing discrepancies
        const targetEmail = email.trim().toLowerCase();
        const targetTenantSlug = tenant?.trim().toLowerCase();

        // 1. QUERY ADMIN ACCOUNTS WITH TIGHT TENANT FILTER
        if (role === "admin") {
            const { data, error } = await supabase
                .from("fleetmaster_admins")
                .select("*, fleetmaster_tenants!inner(*)")
                .eq("email", targetEmail)
                // .eq("fleetmaster_tenants.slug", targetTenantSlug) // Restricts admin explicitly to this tenant space
                .maybeSingle();

            if (error) throw error;
            userAccount = data;
        } 
        
        // 2. QUERY CLIENT ACCOUNTS WITH TIGHT TENANT FILTER
        else if (role === "client") {
            const { data, error } = await supabase
                .from("fleetmaster_clients")
                .select("*, fleetmaster_tenants!inner(*)")
                .eq("email", targetEmail)
                .eq("fleetmaster_tenants.slug", targetTenantSlug) // Restricts client explicitly to this tenant space
                .maybeSingle();

            if (error) throw error;
            userAccount = data;
        } 
        
        else {
            return NextResponse.json({ error: "Invalid role specified" }, { status: 400 });
        }

        // 3. Fail explicitly if no user matches BOTH the email AND the tenant slug boundary
        if (!userAccount) {
            return NextResponse.json({ error: "Invalid credentials or unauthorized tenant access" }, { status: 401 });
        }

        // 4. Validate password hashes safely
        const isMatch = await compare(password, userAccount.password || "");
        if (!isMatch) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        // 5. Package clean state parameters into the JWT payload 
        const tokenPayload = {
            id: userAccount.id,
            tenant_id: userAccount.tenant_id,
            email: userAccount.email,
            role: role === "admin" ? userAccount.role : "Client",
            accountType: role,
        };

        const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: "7d" });

        // Strip the raw password hash out of the server response object for security clean-up
        const { password: _, ...safeUserAccount } = userAccount;

        const response = NextResponse.json({ success: true, user: safeUserAccount }, { status: 200 });

        response.cookies.set({
            name: "user_session",
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 7, // 7 days matching maximum threshold
            path: "/",
        });

        return response;

    } catch (err) {
        console.error("Login critical exception boundary:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}