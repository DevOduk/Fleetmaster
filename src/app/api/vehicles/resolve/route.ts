// src/app/api/vehicles/resolve/route.ts
import { NextResponse } from "next/server";
import { getCachedVehicles } from "@/utils/vehicles-cache";

export async function GET(request: Request) {
  try {

    const vehicles = await getCachedVehicles();

    if (!vehicles) {
      return NextResponse.json(
        { error: "Requested fleet vehicles workspace does not exist" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        vehicles,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=600, stale-while-revalidate=59",
        },
      }
    );

  } catch (err) {
    console.error("Vehicles workspace resolution endpoint crash:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}