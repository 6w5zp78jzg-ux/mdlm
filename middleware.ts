import { NextRequest, NextResponse } from "next/server";

const locales = ["en", "es", "fr", "ru"];
const defaultLocale = "es";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith("/" + locale + "/") || pathname === "/" + locale
  );

  if (pathnameHasLocale) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = "/" + defaultLocale + pathname;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon\\.ico|videos|gallery|fonts|[^/]+\\.[^/]+$).*)"],
};
