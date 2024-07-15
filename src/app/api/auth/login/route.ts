import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const response = await axios.post(`${process.env.BASE_URL}/login`, {
      email,
      password,
    });

    return NextResponse.json(response.data, {
      status: 200,
      headers: {
        'Set-Cookie': `token=${response.data.token}; Path=/;sameSite=strict; httpOnly=true; maxAge=60*60*24`,
      },
    });
  } catch (error: any) {
    console.log('Error:', error);
    return NextResponse.json(
      { error: error.response?.data?.error },
      { status: error.response?.status },
    );
  }
}
