import { NextResponse, type NextRequest } from "next/server";

const LOCALES = ["ar", "en"];
const COOKIE = "wasma-lang";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split("/")[1];
  if (LOCALES.includes(first)) return;

  // Arabic is the default. A visitor who chose English keeps it on bare URLs.
  const saved = request.cookies.get(COOKIE)?.value;
  const lang = saved && LOCALES.includes(saved) ? saved : "ar";
  const url = request.nextUrl.clone();
  url.pathname = `/${lang}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!api|_next|images|icon|apple-icon|favicon|robots.txt|sitemap.xml|.*\\.[a-zA-Z0-9]+$).*)"],
};
