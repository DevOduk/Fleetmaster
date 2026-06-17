// src/app/api/auth/admin/me/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("admin_session");

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

    const { data: adminAccount } = await supabase
      .from("fleetmaster_main_admins")
      .select("*")
      .eq("id", decoded.id)
      .maybeSingle();

    if (!adminAccount) {
      return NextResponse.json({ error: "Admin profile no longer exists" }, { status: 404 });
    }




    return NextResponse.json({ user: adminAccount }, { status: 200 });

  } catch (err) {
    console.error("Session verification routing crash:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}