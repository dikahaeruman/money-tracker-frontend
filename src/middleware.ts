import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';

const PUBLIC_PATHS = ['/login', '/signup', '/forgot-password'];

function isPublicPath(path: string): boolean {
  return PUBLIC_PATHS.includes(path);
}

async function verifyToken(): Promise<boolean> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/verify`, {
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

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = cookies().get('token')?.value;
  const isValidToken = token && token.trim() !== '';

  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  if (isPublicPath(pathname)) {
    if (isValidToken && await verifyToken()) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  } else if (!isValidToken || !(await verifyToken())) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};