// app/api/intasend/status/route.ts
import { NextResponse } from 'next/server';
import IntaSend from 'intasend-node';


export async function POST(request: Request) {
    try {
        const { invoice_id } = await request.json();

        // Handle development environment bypass mock status cleanly
        if (invoice_id.startsWith('MOCK_')) {
            return NextResponse.json({ state: "COMPLETE" });
        }

        const intasend = new IntaSend(
            process.env.NEXT_PUBLIC_INTASEND_PUBLISHABLE_KEY,
            process.env.INTASEND_SECRET_KEY,
            true // Change to false for production execution
        );

        // Check instance tracking records via standard collection engine
        const statusResponse = await intasend.collection().status(invoice_id);
        
        // Returns payload containing: invoice: { state: "PENDING" | "COMPLETE" | "FAILED" }
        return NextResponse.json({ state: statusResponse.invoice?.state, data: statusResponse });

    } catch (err: any) {
        console.error("Status check failure:", err);
        return NextResponse.json({ error: "Failed to fetch status package" }, { status: 500 });
    }
}