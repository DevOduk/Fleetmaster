// src/app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { compare } from "bcrypt-ts";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

export async function POST(request: Request) {
    try {
        // 1. Destructure role ('admin' | 'client') explicitly passed from your frontend form context
        const { role, email, password, tenant } = await request.json();
        if (!role || !email || !password) {
            return NextResponse.json(
                { error: "Role, email, and password are required" },
                { status: 400 }
            );
        }

        const supabase = await createClient();
        let userAccount = null;

        // 2. Query target table directly based on explicit frontend selection
        if (role === "admin") {
            const { data } = await supabase
                .from("fleetmaster_admins")
                .select("*, fleetmaster_tenants(*)") // <-- Implicit Join                .eq("email", email)
                .maybeSingle();
            userAccount = data;
        } else if (role === "client") {
            const { data } = await supabase
                .from("fleetmaster_clients")
                .select("*")
                .eq("email", email)
                .maybeSingle();
            userAccount = data;
        } else {
            return NextResponse.json({ error: "Invalid role specified" }, { status: 400 });
        }

        // 3. Check if user wasn't found in the targeted pool
        if (!userAccount) {
            return NextResponse.json({ error: "Invalid email!" }, { status: 401 });
        }

        // 4. Validate password using secure micro-hashing execution
        const isMatch = await compare(password, userAccount.password || "");

        if (!isMatch) {
            return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
        }

        // 5. Build consistent JWT payload claims (supports me.ts fallback)
        const tokenPayload = {
            id: userAccount.id,
            tenant_id: userAccount.tenant_id,
            email: userAccount.email,
            role: role === "admin" ? userAccount.role : "Client",
            accountType: role,
        };

        // 6. Sign your token string (1-day expiration span)
        const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: "1d" });


        // 8. Pack token safely inside an HttpOnly cookie block wrapper
        const response = NextResponse.json({ success: true, user: userAccount }, { status: 200 });

        response.cookies.set({
            name: "fleet_session",
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