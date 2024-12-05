import {clerkMiddleware, createRouteMatcher} from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)' ,
  "/",
  "/dashboard(.*)", // dashboard page
  "/match(.*)", // prof adding page
]);

export default clerkMiddleware( async (auth, request) => {
  if(!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!.*\\..*|_next).*)",
    "/",
    "/(api|trpc)(.*)"
  ],
};