// Boilerplate copied from NextJS documentation: https://nextjs.org/docs/15/app/api-reference/file-conventions/middleware

//TODO: add unit tests.
//   note: middleware unit testing library exists for next, but is unstable/experimental (v15)

import { NextResponse, NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
}

export const config = {
    matcher: "/",
};
