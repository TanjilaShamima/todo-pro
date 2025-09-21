import { requireAuth } from '@/@lib/server/auth'
import { deleteTodo, getTodo, updateTodo } from '@/@lib/server/todos'
import { todoPatchSchema } from '@/@schemas/zodSchema'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
export const runtime = 'nodejs'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { userId } = await requireAuth(req.headers.get('authorization'))
        const { id } = await params
        const t = await getTodo(userId, id)
        if (!t) return NextResponse.json({ error: 'Not found' }, { status: 404 })
        return NextResponse.json(t)
    } catch (e) {
        if (process.env.NODE_ENV !== 'production') console.warn('GET /api/todos/[id] error:', e)
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { userId } = await requireAuth(req.headers.get('authorization'))
        const patch = todoPatchSchema.parse(await req.json())
        const { id } = await params
        const t = await updateTodo(userId, id, patch)
        if (!t) return NextResponse.json({ error: 'Not found' }, { status: 404 })
        return NextResponse.json(t)
    } catch (e) {
        if (process.env.NODE_ENV !== 'production') console.warn('PATCH /api/todos/[id] error:', e)
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { userId } = await requireAuth(req.headers.get('authorization'))
        const { id } = await params
        const ok = await deleteTodo(userId, id)
        if (!ok) return NextResponse.json({ error: 'Not found' }, { status: 404 })
        return NextResponse.json({ ok: true, id })
    } catch (e) {
        if (process.env.NODE_ENV !== 'production') console.warn('DELETE /api/todos/[id] error:', e)
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
}
