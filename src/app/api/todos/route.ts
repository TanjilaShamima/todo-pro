export const runtime = 'nodejs'
import { requireAuth } from '@/@lib/server/auth'
import { createTodo, listTodos } from '@/@lib/server/todos'
import { todoSchema } from '@/@schemas/zodSchema'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
    try {
        const auth = await requireAuth(req.headers.get('authorization'))
        const url = new URL(req.url)
        const page = Number(url.searchParams.get('page') ?? '1')
        const limitParam = url.searchParams.get('limit') ?? '10'
        const limit = limitParam === 'all' ? Number.MAX_SAFE_INTEGER : Number(limitParam)
        const q = url.searchParams.get('q') ?? ''
        const statusParam = (url.searchParams.get('status') ?? 'all')
        const statusVals = ['todo', 'in_progress', 'done', 'all'] as const
        const isStatus = (v: string): v is typeof statusVals[number] => (statusVals as readonly string[]).includes(v)
        const status = isStatus(statusParam) ? statusParam : 'all'
        const sortParam = (url.searchParams.get('sort') ?? 'createdAt')
        const sortVals = ['createdAt', 'dueDate', 'priority'] as const
        const isSort = (v: string): v is typeof sortVals[number] => (sortVals as readonly string[]).includes(v)
        const sort = isSort(sortParam) ? sortParam : 'createdAt'
        const priorityParam = url.searchParams.get('priority') as 'low' | 'medium' | 'high' | null
        const res = await listTodos({ userId: auth.userId, page, limit, q, status, sort, ...(priorityParam ? { priority: priorityParam } : {}) })
        return NextResponse.json(res)
    } catch (e) {
        if (process.env.NODE_ENV !== 'production') console.warn('GET /api/todos error:', e)
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
}

export async function POST(req: Request) {
    try {
        const { userId } = await requireAuth(req.headers.get('authorization'))
        const body = await req.json()
        const parsed = todoSchema.parse(body)
        const created = await createTodo(userId, parsed)
        return NextResponse.json(created)
    } catch (e) {
        const msg = (e as Error).message || 'Bad request'
        const code = msg === 'Unauthorized' ? 401 : 400
        if (process.env.NODE_ENV !== 'production') console.warn('POST /api/todos error:', e)
        return NextResponse.json({ error: msg }, { status: code })
    }
}
