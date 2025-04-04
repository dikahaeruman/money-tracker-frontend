import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/accounts`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Cookie: (await cookies()).toString(),
        },
        credentials: 'include',
      }
    );

    if (!apiResponse.ok) {
      const errorData = await apiResponse.text();
      console.error('Error Data:', errorData);
      return NextResponse.json(
        { error: errorData || 'An unknown error occurred' },
        { status: apiResponse.status },
      );
    }

    const apiResponseJson = await apiResponse.json();

    const { message, data } = apiResponseJson;

    return NextResponse.json(
      { message, data },
      { status: apiResponse.status }
    );
  } catch (error: any) {
    console.log('Error:', error);
    return NextResponse.json(
      { error: error.message || 'An unknown error occurred' },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const { account_name, balance, currency_id } = await request.json();

    const apiResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/accounts`,
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

    if (!apiResponse.ok) {
      const errorData = await apiResponse.text();
      console.error('Error Data:', errorData);
      return NextResponse.json(
        { error: errorData || 'An unknown error occurred' },
        { status: apiResponse.status },
      );
    }

    // Parse the JSON response
    const jsonResponse = await apiResponse.json();

    return NextResponse.json(jsonResponse, {
      status: apiResponse.status,
    });
  } catch (error: any) {
    console.log('Error:', error);
    return NextResponse.json(
      { error: error.message || 'An unknown error occurred' },
      { status: 500 },
    );
  }
}
