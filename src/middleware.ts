import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const maintenance = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true';

  if (maintenance) {
    // Allow the maintenance page itself and static assets
    const path = request.nextUrl.pathname;
    if (path === '/maintenance' || path.startsWith('/_next') || path.startsWith('/favicon')) {
      return NextResponse.next();
    }

    // Redirect everything else to maintenance page
    return NextResponse.rewrite(new URL('/maintenance', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
