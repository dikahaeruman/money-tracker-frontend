import { NextResponse, NextRequest } from 'next/server';

export default function middleware(request: NextRequest) {
  const currentUser = request.cookies.get('token')?.value;
  const authenticated = false;

  /*
    todo: implement authorization logic
  */

  if (!currentUser && request.nextUrl.pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (currentUser && request.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|auth|favicon.ico|robots.txt|images|assets|$).*)',
  ],
};
