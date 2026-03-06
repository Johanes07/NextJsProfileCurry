import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function proxy(request: NextRequest) {
    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET
    })
    const pathname = request.nextUrl.pathname

    const isProtected =
        pathname.startsWith('/dashboard') ||
        pathname.startsWith('/services') ||
        pathname.startsWith('/portfolio') ||
        pathname.startsWith('/blog') ||
        pathname.startsWith('/messages') ||
        pathname.startsWith('/settings')

    if (isProtected && !token) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/dashboard/:path*', '/services/:path*', '/portfolio/:path*', '/blog/:path*', '/messages/:path*', '/settings/:path*'],
}