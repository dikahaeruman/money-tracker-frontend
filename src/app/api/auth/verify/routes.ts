import { NextResponse } from 'next/server'; // Make sure to import NextResponse if not already done
import { cookies } from 'next/headers'; // Import cookies if necessary

export async function GET() {
  try {
    const fetchResponse = await fetch(`${process.env.BASE_URL}/verify`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookies().toString()
      },
      credentials: 'include'
    });

    // Get the JSON data from the fetch response
    const { message, data } = await fetchResponse.json();

    // Return the appropriate JSON response
    return NextResponse.json({
      message,
      data
    }, {
      status: fetchResponse.status,
    });
  } catch (error: any) {
    console.log('Error:', error);
    return NextResponse.json(
      { error: error.message || 'An unknown error occurred' },
      { status: error.status || 500 },
    );
  }
}
