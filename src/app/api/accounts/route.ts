import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/accounts`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Cookie: cookies().toString(),
        },
        credentials: 'include',
      },
    ).then((response) => response.json());

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

export async function POST(request: Request) {
  try {
    const { name, balance, currency } = await request.json();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/accounts`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: cookies().toString(),
        },
        credentials: 'include',
        body: JSON.stringify({ account_name: name, balance, currency }),
      },
    ).then((response) => response.json());

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