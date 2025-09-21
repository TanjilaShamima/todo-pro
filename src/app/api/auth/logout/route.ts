import { destroySession } from '@/@lib/server/auth'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    const auth = req.headers.get('authorization')
    const token = auth && auth.startsWith('Bearer ') ? auth.split(' ')[1] : null
    await destroySession(token)
    return NextResponse.json({ ok: true })
}
