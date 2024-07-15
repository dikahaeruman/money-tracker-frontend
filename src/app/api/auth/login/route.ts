import { NextResponse } from 'next/server';
import axios from 'axios';

export async function postLogin(request: Request) {
  const { email, password } = await request.json();

  try {
    const response = await axios.post('http://localhost:8181/login', {
      email,
      password,
    });

    const token = response.data.token;
    const maxAge = 60 * 60 * 24;

    return NextResponse.json(response.data, {
      status: 200,
      headers: {
        'Set-Cookie': `token=${token}; Path=/; SameSite=Strict; HttpOnly; Max-Age=${maxAge}`,
      },
    });
  } catch (error: any) {
    const status = error.response?.status || 500;
    const errorData = error.response?.data?.error || 'Internal server error';

    return NextResponse.json({ error: errorData }, { status });
  }
}
