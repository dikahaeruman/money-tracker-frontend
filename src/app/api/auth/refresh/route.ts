import { NextResponse } from 'next/server';

export async function GET(refreshToken: string) {
  try {

    const response = await fetch(`${process.env.BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (response.ok) {
        const data = await response.json(); // Parse the JSON response
        const setCookieHeader = response.headers.get("set-cookie"); // Use get() to retrieve the header

        // Check if the response contains a new token
        if (data.status === "success" && data.data.token) {
          // Return the new token and set-cookie header
          return {
            setCookieHeader,
            newToken: data.data.token,
          };
        }
      }

      return null; // Indicate failure

  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: error.message || 'An unknown error occurred' },
      { status: error.status || 500 },
    );
  }
}