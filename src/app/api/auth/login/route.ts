import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData.error || 'Login failed' }, { status: response.status });
    }

    const { data } = await response.json();
    
    if (!data.token) {
      return NextResponse.json({ error: 'Token not received' }, { status: 500 });
    }

    cookies().set('token', data.token, { maxAge: 900, httpOnly: true, secure: process.env.NODE_ENV === 'production' });

    return NextResponse.json({ message: 'Login successful' }, { status: 200 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}