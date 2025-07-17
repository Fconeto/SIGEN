
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { GlobalService } from "./services/global-service";
import { UserRole } from "./domain/entities/user";

const roleAccessConfig: Record<UserRole, {
    path: string,
    allowedPaths: string[]
}> = {
    [UserRole.AGENT]: {
        path: '/agent',
        allowedPaths: ['/auth/login', '/'],
    },
    [UserRole.CHIEF_AGENT]: {
        path: '/chief-agent',
        allowedPaths: ['/auth', '/'],
    },
}

function isPathAllowed(path: string, role: UserRole): boolean {
    const config = roleAccessConfig[role]
    return config.allowedPaths.some((allowedPath) =>
        path === allowedPath || path.startsWith(allowedPath + '/') || path.startsWith(config.path)
    )
}

export function middleware(request: NextRequest) {
    const token = request.cookies.get('authToken')?.value;
    const path = request.nextUrl.pathname;
    const isRootPath = path === '/';
    const isLoginPage = path === '/auth/login';

    if (!token && !isLoginPage) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    if (token) {
        if (isLoginPage || isRootPath) {
            return NextResponse.redirect(new URL('/agent', request.url));
        }
        return;
    }
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|next|favicon\\.ico|sw|workbox|fallback|.*\\.(?:ico|svg|png|jpg|jpeg|gif|webp|woff|woff2|ttf|eot|json|txt|xml|csv)).*)"
    ],
};