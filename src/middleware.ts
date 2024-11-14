import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { setCookiesFromHeader } from './utils/cookieUtils';

const PUBLIC_PATHS = ['/login', '/signup', '/forgot-password'];

function isPublicPath(path: string): boolean {
  return PUBLIC_PATHS.includes(path);
}

async function verifyToken(): Promise<boolean> {
  try {
    const response = await fetch(`${process.env.BASE_URL}/verify`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookies().toString()
      },
      credentials: 'include',
    });
    return response.ok;
  } catch (error) {
    console.error('Error verifying token:', error);
    return false;
  }
}

async function refreshAccessToken(refreshToken: string) {
  const response = await fetch(`${process.env.BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (response.ok) {
    const data = await response.json();
    const setCookieHeader = response.headers.get("set-cookie");

    if (data.status === "success" && data.data.token) {
      return {
        setCookieHeader,
        newToken: data.data.token,
      };
    }
  }

  return null;
}

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = cookies().get('token')?.value;
  const refreshToken = cookies().get('refresh_token')?.value;

  const isValidToken = token && token.trim() !== '';

  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  if (isPublicPath(pathname)) {
    if (isValidToken && await verifyToken()) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  if (!isValidToken && refreshToken && refreshToken.trim() !== '') {
    const refreshResult = await refreshAccessToken(refreshToken);
    if (refreshResult) {
      const { setCookieHeader } = refreshResult;
      const response = NextResponse.next();
      if (setCookieHeader) {
        setCookiesFromHeader(request, setCookieHeader);
      }
      return response;
    }
  }

  if (!isValidToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};