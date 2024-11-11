import { NextResponse} from 'next/server';

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
    const { message, data } = await response.json();

    // Create a response object
    const res = NextResponse.json({ message }, { status: 200 });

    if (!data.token) {
      return NextResponse.json({ error: 'Token not received' }, { status: 500 });
    }

    if (!data.refresh_token) {
      return NextResponse.json({ error: 'Refresh Token not received' }, { status: 500 });
    }

    const setCookieHeader = response.headers.get("set-cookie");
    if (setCookieHeader) {
      // Use the NextResponse to set cookies directly from the response headers
      const responseData = NextResponse.json({ message, data }, { status: 200 });
      responseData.headers.append('Set-Cookie', setCookieHeader); // Append the cookie header to the response
      return responseData; // Return the response with cookies set
    }

    return res; // Return the modified response
  }

  return NextResponse.json({ message: 'Login failed' }, { status: 401 });
}