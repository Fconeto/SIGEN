import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
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
        path === allowedPath || path.startsWith(allowedPath + '/') || config.path === path
    )
}

export function middleware(request: NextRequest) {
    const globalService = GlobalService.getInstance()
    const isAuthenticated = globalService.isAuthenticated()
    const user = globalService.getUser()
    const path = request.nextUrl.pathname

    const isRootPath = path === '/'
    const isLoginPage = path === '/auth/login'

    if ((!isAuthenticated || !user) && !isLoginPage) {
        globalService.logout()
        return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    if (isAuthenticated && user) {
        const config = roleAccessConfig[user.role]

        if (isLoginPage || isRootPath) {
            return NextResponse.redirect(new URL(config.path, request.url))
        }

        if (!isPathAllowed(path, user.role)) {
            return NextResponse.redirect(new URL(config.path, request.url))
        }
    }
}
export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|next|favicon\\.ico|sw|workbox|fallback|.*\\.(?:ico|svg|png|jpg|jpeg|gif|webp|woff|woff2|ttf|eot|json|txt|xml|csv)).*)"
    ],
};