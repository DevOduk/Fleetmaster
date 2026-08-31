import { NextResponse } from "next/server";
import getDarajaAccessToken from "../getDarajaAccessToken";

// Helper to pause execution for rate limit management
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function POST(request: Request) {
  try {
    const { checkoutRequestID } = await request.json();

    const timestamp = new Date()
      .toISOString()
      .replace(/[^0-9]/g, "")
      .slice(0, 14);
    const shortCode = "174379";
    const passkey =
      "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919";
    const password = Buffer.from(shortCode + passkey + timestamp).toString(
      "base64",
    );

    const accessToken = await getDarajaAccessToken();

    const payload = {
      BusinessShortCode: shortCode,
      Password: password,
      Timestamp: timestamp,
      CheckoutRequestID: checkoutRequestID,
    };

    let response = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      },
    );

    let data = await response.json();

    // Handle Safaricom Spike Arrest / Rate Limiting automatically with a retry
    if (
      data.fault &&
      data.fault.detail?.errorcode === "policies.ratelimit.SpikeArrestViolation"
    ) {
      console.warn("Spike arrest hit, waiting 3 seconds before retry...");
      await sleep(3000); // Wait 3 seconds to clear the rate-limit window

      // Generate a fresh timestamp and password for the retry attempt
      const retryTimestamp = new Date()
        .toISOString()
        .replace(/[^0-9]/g, "")
        .slice(0, 14);
      const retryPassword = Buffer.from(
        shortCode + passkey + retryTimestamp,
      ).toString("base64");

      const retryPayload = {
        BusinessShortCode: shortCode,
        Password: retryPassword,
        Timestamp: retryTimestamp,
        CheckoutRequestID: checkoutRequestID,
      };

      // Retry once with updated timestamp
      response = await fetch(
        "https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(retryPayload),
        },
      );
      data = await response.json();
    }

    if (data.fault) {
      return NextResponse.json(
        {
          ResultCode: "PROCESSING",
          ResultDesc:
            "Too many requests! Wait for a few minutes and try again.",
        },
        { status: 200 },
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
