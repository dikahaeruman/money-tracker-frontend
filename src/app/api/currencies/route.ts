import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/currencies`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Cookie: (await cookies()).toString(),
            },
            credentials: 'include',
        });
        console.log('API Response Currency:', response);
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error Data:', errorData);
            return NextResponse.json(
                { error: errorData.message || 'An unknown error occurred' },
                { status: response.status }
            );
        }
        const { message, data } = await response.json();
        return NextResponse.json(
            { message, data }, 
            { status: response.status }
        );
    } catch (error: any) {
        console.log('Error:', error);
        return NextResponse.json(
            { error: error.message || 'An unknown error occurred' },
            { status: error.status || 500 },
        );
    }
}