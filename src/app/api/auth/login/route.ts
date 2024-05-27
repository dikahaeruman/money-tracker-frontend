import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  try {
    let nextResponse = NextResponse.next();
    const { username, password } = await request.json();
    const response = await axios.post('http://localhost:8080/login', {
      username,
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
  }
}
