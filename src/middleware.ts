import { NextResponse } from 'next/server'

// No-op middleware while using localStorage-based auth.
// Server cannot read localStorage, so client-side ProtectedRoute handles redirects.
export function middleware() {
    return NextResponse.next()
}