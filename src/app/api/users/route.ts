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
    }).then((response) => response);
    const { message, data } = await response.json();
    return NextResponse.json({
      message: message,
      data: data
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