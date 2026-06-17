// src/app/api/auth/me/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("fleet_session");

    // 1. If no session cookie exists, user is unauthenticated (anonymous client view)
    if (!sessionCookie) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    // 2. Decode and verify the JWT signature integrity
    let decoded: any;
    try {
      decoded = jwt.verify(sessionCookie.value, JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    const supabase = await createClient();
    let userAccount = null;

    // Normalize incoming key definitions checking both 'accountType' and 'role'
    const targetAccountType = decoded.accountType || decoded.role;
    const normalizedType = (targetAccountType === "admin" || targetAccountType === "client") 
      ? targetAccountType 
      : "client";

    // 3. Re-verify user record exists AND pull tenant details using implicit join
    if (normalizedType === "admin") {
      const { data } = await supabase
        .from("fleetmaster_admins")
        .select("*, fleetmaster_tenants(*)")
        .eq("id", decoded.id)
        .maybeSingle();
      userAccount = data;
    } else if (normalizedType === "client") {
      const { data } = await supabase
        .from("fleetmaster_clients")
        .select("*, fleetmaster_tenants(*)")
        .eq("id", decoded.id)
        .maybeSingle();
      userAccount = data;
    }

    if (!userAccount) {
      return NextResponse.json({ error: "User profile no longer exists" }, { status: 404 });
    }




    return NextResponse.json({ user: userAccount }, { status: 200 });

  } catch (err) {
    console.error("Session verification routing crash:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}