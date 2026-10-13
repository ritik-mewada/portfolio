import { NextResponse, type NextRequest } from "next/server";
import { projects } from "@/content/site";

const slugs = new Set(projects.map((p) => p.slug));

// With Cache Components on, a project page that calls notFound() has already started
// streaming with a 200 status. Unknown slugs are caught here instead, so they get a real 404.
export function proxy(request: NextRequest) {
  const slug = request.nextUrl.pathname.split("/")[2];
  if (!slugs.has(decodeURIComponent(slug))) {
    return NextResponse.rewrite(new URL("/404", request.url));
  }
}

export const config = { matcher: "/projects/:slug" };
