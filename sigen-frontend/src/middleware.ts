import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { GlobalService } from "./services/global-service";
import { UserRole } from "./domain/entities/user";
import { baseUrlNormalized } from "./lib/utils";


const roleRedirects = {
    [UserRole.AGENT]: "/agent",
    [UserRole.CHIEF_AGENT]: "/chief-agent",
}

export function middleware(request: NextRequest) {
    const globalService = GlobalService.getInstance();
    const isAuthenticated = globalService.isAuthenticated();
    const path = request.nextUrl.pathname;

    const isRootPath = path === "/";

    const isPagesValidToReditectToApp = path === "/auth/login" || isRootPath;
    const isPagesValidToReditectToAuth = path !== "/auth/login";

    if (!isAuthenticated && isPagesValidToReditectToAuth) {
        return NextResponse.redirect(new URL(baseUrlNormalized("/auth/login"), request.url));
    }

    if (isPagesValidToReditectToApp && isAuthenticated) {
        const userRole = globalService.getUser()!.role;
        return NextResponse.redirect(new URL(roleRedirects[userRole] || "/auth/login", request.url));
    }
    return NextResponse.next();
}
export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|next|favicon\\.ico|sw|workbox|fallback|.*\\.(?:ico|svg|png|jpg|jpeg|gif|webp|woff|woff2|ttf|eot|json|txt|xml|csv)).*)"
    ],
};