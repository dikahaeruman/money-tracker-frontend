import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiResponse = await fetch(
      `${process.env.BASE_URL}/accounts`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Cookie: (await cookies()).toString(),
        },
        credentials: 'include',
      },
    ).then((response) => response.json());

    return NextResponse.json(apiResponse.data, {
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
    const { account_name, balance, currency_id } = await request.json();

    const apiResponse = await fetch(
      `${process.env.BASE_URL}/accounts`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: (await cookies()).toString(),
        },
        credentials: 'include',
        body: JSON.stringify({ account_name, balance, currency_id }),
      }
    );

    const jsonResponse = await apiResponse.json();

    return NextResponse.json(jsonResponse, {
      status: apiResponse.status,
    });

  } catch (error: any) {
    console.log('Error:', error);
    return NextResponse.json(
      { error: error.message || 'An unknown error occurred' },
      { status: error.status || 500 },
    );
  }
}