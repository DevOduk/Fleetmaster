import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json(
      { success: true, message: "Logged out successfully" },
      { status: 200 }
    );

    const isProd = process.env.NODE_ENV === "production";
    // 🌟 Double check your application tab to confirm this name matches perfectly!
    const cookieName = "user_session"; 

    // Target Option A: Domain-scoped cookie clear
    response.cookies.set({
      name: cookieName,
      value: "",
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      maxAge: 0,
      expires: new Date(0), // Extra assurance for older browsers
      path: "/",
      domain: isProd ? ".fleetmaster.com" : "localhost", // Removed leading dot for local dev
    });

    // Target Option B: Host-only fallback clear (Fixes standard localhost drops)
    response.cookies.set({
      name: cookieName,
      value: "",
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      maxAge: 0,
      expires: new Date(0),
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("Logout error exception:", err);
    return NextResponse.json(
      { error: "Internal Server Error during logout" },
      { status: 500 }
    );
  }
}