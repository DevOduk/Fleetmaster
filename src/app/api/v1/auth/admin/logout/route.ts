import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json(
      { success: true, message: "Logged out successfully" },
      { status: 200 },
    );

    // 1. Overwrite the cookie to destroy the session instantly
    response.cookies.set({
      name: "admin_session", // Use "fleet_session" here if you synchronized them earlier!
      value: "",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0, // Tells the browser to delete the cookie immediately
      path: "/",
      // If handling cross-subdomains locally/prod, keep the domain scoped:
      domain:
        process.env.NODE_ENV === "production"
          ? ".fleetmaster.com"
          : ".localhost",
    });

    return response;
  } catch (err) {
    console.error("Logout error exception:", err);
    return NextResponse.json(
      { error: "Internal Server Error during logout" },
      { status: 500 },
    );
  }
}
