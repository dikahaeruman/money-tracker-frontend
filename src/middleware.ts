"use server"
import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { setCookiesFromHeader } from './utils/cookieUtils';

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

async function refreshAccessToken(refreshToken: string) {
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
}

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = cookies().get('token')?.value;
  const refreshToken = cookies().get('refresh_token')?.value;

  const isValidToken = token && token.trim() !== '';

  // Prevent redirect loops by checking if already on login or set-cookies page
  if (pathname === '/login') {
    return NextResponse.next();
  }

  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  if (isPublicPath(pathname)) {
    if (isValidToken && await verifyToken()) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  } 

  // If the token is invalid or not present, attempt to refresh it
  if (!isValidToken) {
    if (refreshToken && refreshToken.trim() !== '') {
      const refreshResult = await refreshAccessToken(refreshToken); // Call the refresh function
      if (refreshResult) {
        const { setCookieHeader, newToken } = refreshResult;

        // Create a response object
        const response = NextResponse.next();

        // Set the cookies directly in the response
        if (setCookieHeader) {
          setCookiesFromHeader(request,setCookieHeader); // Use the utility function to set cookies
        }
        if (newToken) {
          response.headers.append('Set-Cookie', `token=${newToken}; Path=/; HttpOnly; Max-Age=86400`); // Set the new token cookie
        }


        return response; // Return the modified response
      }
    }
    
    // If refresh fails or no refresh_token, redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};