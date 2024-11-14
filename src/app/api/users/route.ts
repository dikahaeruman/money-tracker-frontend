import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch(`${process.env.BASE_URL}/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookies().toString()
      },
      credentials: 'include'
    });
    const { message, data } = await response.json();
    return NextResponse.json({
      message,
      data
    }, {
      status: response.status,
    });
  } catch (error: any) {
    console.log('Error:', error);
    return NextResponse.json(
      { error: error.message || 'An unknown error occurred' },
      { status: error.status || 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json();

    const response = await fetch(
      `${process.env.BASE_URL}/users`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password })
      }
    );
    const { message } = await response.json();
    return NextResponse.json({
      message
    }, {
      status: response.status,
    });
  } catch (error: any) {
    console.log('Error:', error);
    return NextResponse.json(
      { error: error.message || 'An unknown error occurred' },
      { status: error.status || 500 },
    );
  }
}