import { NextResponse } from 'next/server';
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    const response = await fetch(`${process.env.BASE_URL}/users/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookies().toString()
      },
      body: JSON.stringify({email}),
      credentials: 'include'
    }).then((response) => response.json());

    return NextResponse.json(response.data, {
      status: 200,
    });
  } catch (error: any) {
    console.log('Error:', error);
    return NextResponse.json(
      { error: error.message || 'An unknown error occurred' },
      { status: error.status || 500 },
    );
  }
}