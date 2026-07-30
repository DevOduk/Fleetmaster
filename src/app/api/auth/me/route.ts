import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createPublicClient } from "@/utils/supabase/server";
import jwt from "jsonwebtoken";
import { unstable_cache } from "next/cache";
import { subscriptionPlans } from "@/data/globalExports";

const JWT_SECRET = process.env.JWT_SECRET;

const getUsersByPlan = (plan: string) => {
  if (!plan) return 0;

  if (plan === 'Trial') {
    return 1;
  } else {
    return subscriptionPlans.find(s => s.name === plan).userAccounts;
  }
};

// Cached user lookup using your stateless client
const getCachedUserAccount = (id: string, normalizedType: "admin" | "client") =>
  unstable_cache(
    async () => {
      // Create the public/stateless client inside the cached closure
      const supabase = createPublicClient();
      const tableName =
        normalizedType === "admin" ? "fleetmaster_admins" : "fleetmaster_clients";

      const { data, error } = await supabase
        .from(tableName)
        .select(
          "id, first_name, last_name, email, phone, created_at, city, verification_status, country, role, tenant_id, postal_code, timezone, language, profile_pic, fleetmaster_tenants(*)"
        )
        .eq("id", id)
        .maybeSingle();

      if (error) {
        console.error("Database error fetching user account:", error);
        return null;
      }

      return data;
    },
    [`user-profile-${id}-${normalizedType}`],
    {
      revalidate: 600, // 10 minutes cache duration
      tags: [`user-${id}`],
    }
  )();

export async function GET() {
  const supabase = createPublicClient();

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
    const normalizedType =
      targetAccountType === "admin" || targetAccountType === "client"
        ? targetAccountType
        : "client";

    // Call the cached function
    const userAccount = await getCachedUserAccount(decoded.id, normalizedType);

    if (!userAccount) {
      return NextResponse.json({ error: "User profile no longer exists" }, { status: 404 });
    }

    // const plan = userAccount?.fleetmaster_tenants?.[0]?.subscription_plan;
    // const maxUsers = getUsersByPlan(plan);

    // // 1. Count how many users in this tenant were created BEFORE or AT THE SAME TIME as this user
    // const { count: userRanking } = await supabase
    //   .from("fleetmaster_admins")
    //   .select("id", { count: "exact", head: true })
    //   .eq("tenant_id", userAccount.tenant_id)
    //   .lte("created_at", userAccount.created_at);

    // // 2. Enforce limit (e.g. ranking 2 > maxUsers 1)
    // if (targetAccountType === "admin" && userRanking && maxUsers !== null && userRanking > maxUsers) {
    //   return NextResponse.json(
    //     { error: "PLAN_LIMIT_EXCEEDED", message: "User quota exceeded for current plan." },
    //     { status: 403 }
    //   );
    // }

    return NextResponse.json(
      { user: userAccount },
      {
        status: 200,
        headers: {
          "Cache-Control": "private, max-age=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (err) {
    console.error("Session verification routing crash:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}