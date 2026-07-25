import createMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';

export const proxy = createMiddleware(routing);

export const config = {
  // opengraph-image is a root-level Next.js metadata route (no file
  // extension in its URL, so the default ".*\\..*" exclusion misses it) —
  // exclude it explicitly so locale routing doesn't intercept it.
  matcher: ['/((?!_next|_vercel|opengraph-image|.*\\..*).*)'],
};
