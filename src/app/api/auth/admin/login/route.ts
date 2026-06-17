// src/app/api/auth/admin/login/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { compare } from "bcrypt-ts";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

export async function POST(request: Request) {
    try {
        // 1. Destructure role ('admin' | 'client') explicitly passed from your frontend form context
        const { email, password } = await request.json();
        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        const supabase = await createClient();

        const { data: adminAccount } = await supabase
            .from("fleetmaster_main_admins")
            .select("*")
            .eq("email", email)
            .maybeSingle();
        // 3. Check if user wasn't found in the targeted pool
        if (!adminAccount) {
            return NextResponse.json({ error: "Invalid email! Admin Account Does Not exist." }, { status: 401 });
        }

        // 4. Validate password using secure micro-hashing execution
        const isMatch = await compare(password, adminAccount.password || "");

        if (!isMatch) {
            return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
        }

        // 5. Build consistent JWT payload claims (supports me.ts fallback)
        const tokenPayload = {
            id: adminAccount.id,
            tenant_id: adminAccount.tenant_id,
            email: adminAccount.email,
            role: adminAccount.role
        };

        // 6. Sign your token string (1-day expiration span)
        const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: "1d" });


        // 8. Pack token safely inside an HttpOnly cookie block wrapper
        const response = NextResponse.json({ success: true, user: adminAccount }, { status: 200 });

        response.cookies.set({
            name: "admin_session",
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
            path: "/",
        });

        return response;

    } catch (err) {
        console.error("Login route exception handling context:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}