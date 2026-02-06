
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    // Create the client to handle cookie management
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value)
                    )
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // IMPORTANT: You *must* run getUser() to trigger the token refresh
    // if the session is expired.
    const {
        data: { user },
    } = await supabase.auth.getUser()

    // Route Protection Logic
    const path = request.nextUrl.pathname;

    // Public Routes (add any new marketing pages here)
    const isPublic = path === '/' || path.startsWith('/auth') || path.startsWith('/login') || path.startsWith('/signup') || path.startsWith('/pricing') || path.startsWith('/api/voice/token') || path.startsWith('/api/refine');
    // Note: API routes guarding is handled inside the route handler usually, but we can block here too.
    // Actually, for API routes, we want to allow them to be called ONLY if the cookie is present? 
    // Or if it's a server-to-server call? 
    // For now, let's keep API routes open in middleware and handle 401 in the route handler for better error JSON.

    if (path.startsWith('/api')) {
        return supabaseResponse;
    }

    if (!user && !isPublic) {
        // Redirect unauthenticated users to login
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    return supabaseResponse
}
