import { NextResponse } from "next/server";
import getDarajaAccessToken from "../getDarajaAccessToken";




export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { phoneNumber, amount } = body;

        // 1. Generate timestamp and password securely on the server
        const timestamp = new Date().toISOString().replace(/[^0-9]/g, "").slice(0, 14);
        const shortCode = "174379";
        const passkey = "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919";
        const password = Buffer.from(shortCode + passkey + timestamp).toString("base64");

        // 2. Fetch OAuth token (ensure you have a function to get your ACCESS token)
        const accessToken = await getDarajaAccessToken();

        const payload = {
            "BusinessShortCode": shortCode,
            "Password": password,
            "Timestamp": timestamp,
            "TransactionType": "CustomerPayBillOnline",
            //   "Amount": amount,
            "Amount": 1,
            "PartyA": phoneNumber,
            "PartyB": shortCode,
            "PhoneNumber": phoneNumber,
            "CallBackURL": "https://cvj3465l-3000.inc1.devtunnels.ms/",
            "AccountReference": "FM-" + (new Date()).getTime(),
            "TransactionDesc": "Fleetmaster CRM Payment"
        };

        // 3. Make the server-to-server request (No CORS restrictions here)
        const mpesaRes = await fetch("https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + accessToken
            },
            body: JSON.stringify(payload)
        });

        const data = await mpesaRes.json();

        console.log('server stk data: ', data)
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}