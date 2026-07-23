// app/api/intasend/status/route.ts
import { NextResponse } from 'next/server';
import IntaSend from 'intasend-node';

export async function POST(request: Request) {
    try {
        const { invoice_id } = await request.json();

        if (invoice_id && invoice_id.startsWith('MOCK_')) {
            return NextResponse.json({ state: "COMPLETE" });
        }

        const intasend = new IntaSend(
            process.env.NEXT_PUBLIC_INTASEND_PUBLISHABLE_KEY!,
            process.env.INTASEND_SECRET_KEY!,
            true 
        );

        const collection = intasend.collection();
        const statusResponse = await collection.status(invoice_id);

        // Extract state safely
        const rawState = 
            statusResponse?.state || 
            statusResponse?.invoice?.state || 
            statusResponse?.data?.invoice?.state || 
            "PENDING";

        // Map IntaSend states to what your frontend loop expects
        let resolvedState = rawState.toUpperCase();
        if (resolvedState === 'PENDING') {
            resolvedState = 'PROCESSING'; // Treat PENDING as PROCESSING so the frontend loop keeps waiting
        }
console.log('statusResponse: ',statusResponse)
        return NextResponse.json({ 
            state: resolvedState, 
            data: statusResponse.data || statusResponse 
        });

    } catch (err: any) {
        console.error("Status check failure:", err);
        return NextResponse.json({ error: "Failed to fetch status package" }, { status: 500 });
    }
}