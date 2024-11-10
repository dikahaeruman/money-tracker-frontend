import { NextResponse } from 'next/server';


export async function POST(request: Request) {
  const { email, password } = await request.json();

  // Replace with your actual login logic
  const response = await fetch(`${process.env.BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (response.ok) {
    const { message,data } = await response.json();

    // Create a response object
    const res = NextResponse.json({ message: message }, { status: 200 });

    if (!data.token) {
      return NextResponse.json({ error: 'Token not received' }, { status: 500 });
    }

    if (!data.refresh_token) {
      return NextResponse.json({ error: 'Refresh Token not received' }, { status: 500 });
    }


    return res; // Return the modified response
  }

  return NextResponse.json({ message: 'Login failed' }, { status: 401 });
}