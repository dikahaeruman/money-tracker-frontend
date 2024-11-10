import { NextRequest } from 'next/server';

export function setCookiesFromHeader(request: NextRequest, setCookieHeader: string) {
  if (setCookieHeader) {
    // Decode the URL-encoded string
    const decodedCookies = decodeURIComponent(setCookieHeader);
    const cookiesArray = decodedCookies.split(','); 
    cookiesArray.forEach((cookie) => {
      const [cookieName, ...cookieAttributes] = cookie.split(";"); // Extract cookie attributes

      // Check if cookieName is defined and contains an '='
      if (cookieName?.includes('=')) {
        const [name, value] = cookieName.split("="); // Split name and value

        // Create an options object for the cookie
        const options: { [key: string]: any } = { 
          httpOnly: true,
        };

        // Parse attributes like Max-Age and Path
        cookieAttributes.forEach(attr => {
          const [key, val] = attr.trim().split("=");
          if (key.toLowerCase() === "max-age") {
            options.maxAge = parseInt(val, 10); // Convert Max-Age to number
          } else if (key.toLowerCase() === "path") {
            options.path = val; // Set Path
          }
        });

        request.cookies.set(name.trim(), value.trim()); // Set the cookie with the specified options
      } else {
        console.error('Invalid cookie format:', cookieName);
      } 
    });
  }
}