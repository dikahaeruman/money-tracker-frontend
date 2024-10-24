import { NextResponse, NextRequest } from 'next/server';
import { verifyToken } from '@/services/authServices';

const PUBLIC_PATHS = ['/login', '/signup', '/forgot-password'];
const STATIC_PATHS = ['/api', '/_next', '/auth', '/favicon.ico', '/robots.txt', '/images', '/assets'];

function isPublicPath(path: string): boolean {
  return PUBLIC_PATHS.includes(path) || STATIC_PATHS.some(prefix => path.startsWith(prefix));
}

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  const isValidToken = token && token.trim() !== '';

  if (isPublicPath(pathname) && isValidToken) {
    try {
      const { statusCode } = await verifyToken(token);
      if (statusCode === 200) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    } catch (error) {
      console.error('Error verifying token:', error);
    }
  }

  if (!isPublicPath(pathname)) {
    if (!isValidToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const { statusCode } = await verifyToken(token);
      if (statusCode !== 200) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    } catch (error) {
      console.error('Error verifying token:', error);
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
