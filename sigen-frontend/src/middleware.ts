
import { Console } from "console";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

function parseJwt(token: string): Record<string, any> | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = Buffer.from(base64, 'base64').toString('utf-8');
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
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
        const payload = parseJwt(token);
        const tipoDeUsuario = payload?.Hierarquia;

        if (tipoDeUsuario === '0' && path.startsWith('/chief-agent')) {
            return NextResponse.redirect(new URL('/agent', request.url));
        }
        if (tipoDeUsuario === '1' && path.startsWith('/agent')) {
            return NextResponse.redirect(new URL('/chief-agent', request.url));
        }

        if (isLoginPage || isRootPath) {
            if (tipoDeUsuario === '0') {
                return NextResponse.redirect(new URL('/agent', request.url));
            } else if (tipoDeUsuario === '1') {
                return NextResponse.redirect(new URL('/chief-agent', request.url));
            }
        }
    }
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|next|favicon\\.ico|sw|workbox|fallback|.*\\.(?:ico|svg|png|jpg|jpeg|gif|webp|woff|woff2|ttf|eot|json|txt|xml|csv)).*)"
    ],
};