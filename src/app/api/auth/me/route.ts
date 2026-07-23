import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import jwt from "jsonwebtoken";
import { cache } from "react";

export const dynamic = "force-dynamic";

const JWT_SECRET = process.env.JWT_SECRET;

// Wrap the database lookup in React.cache to memoize it per-request
const fetchUserAccount = cache(async (id: string, normalizedType: "admin" | "client") => {
  const supabase = await createClient();

  const tableName = normalizedType === "admin" ? "fleetmaster_admins" : "fleetmaster_clients";

  // Optimize: Select specific fields instead of wildcard (*) if possible, 
  const { data, error } = await supabase
    .from(tableName)
    .select("id, first_name, last_name, email, phone, created_at, city,verification_status, country, role, tenant_id, postal_code, timezone, language, profile_pic, fleetmaster_tenants(*)")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Database error fetching user account:", error);
    return null;
  }

  return data;
});

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("user_session");

    if (!sessionCookie) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(sessionCookie.value, JWT_SECRET!);
    } catch (err) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    const targetAccountType = decoded.accountType || decoded.role;
    const normalizedType = (targetAccountType === "admin" || targetAccountType === "client")
      ? targetAccountType
      : "client";

    // Call the memoized fetch function
    const userAccount = await fetchUserAccount(decoded.id, normalizedType);

    if (!userAccount) {
      return NextResponse.json({ error: "User profile no longer exists" }, { status: 404 });
    }

    return NextResponse.json({ user: userAccount }, { status: 200 });

  } catch (err) {
    console.error("Session verification routing crash:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}