import { todoPatchSchema, todoSchema } from '@/@schemas/zodSchema';
import { http, HttpResponse } from 'msw';
import { db, delay, getSessionFromHeader, maybeFail } from '../db';


export const todoHandlers = [
    http.get('/api/todos', async ({ request }) => {
        await delay(200 + Math.random() * 500); maybeFail()
        const sess = getSessionFromHeader(request.headers)
        if (!sess) return new HttpResponse('Unauthorized', { status: 401 })
        const url = new URL(request.url)
        const page = Number(url.searchParams.get('page') ?? 1)
        const limit = Number(url.searchParams.get('limit') ?? 10)
        const q = (url.searchParams.get('q') ?? '').toLowerCase()
        const status = url.searchParams.get('status') ?? 'all'
        const sortParam = url.searchParams.get('sort') ?? 'createdAt'
        const sortVals = ['createdAt', 'dueDate', 'priority'] as const
        type SortKey = typeof sortVals[number]
        const sort: SortKey = (sortVals as readonly string[]).includes(sortParam) ? (sortParam as SortKey) : 'createdAt'


        let items = db.todos.filter(t => t.userId === sess.userId)
        if (q) items = items.filter(t => (t.title + t.description).toLowerCase().includes(q))
        if (status !== 'all') items = items.filter(t => t.status === status)
        const val = (t: Record<string, unknown> & { priority?: 'low' | 'medium' | 'high'; createdAt?: string; dueDate?: string }, k: SortKey): string => (k === 'priority' ? (t.priority ?? '') : (typeof t[k] === 'string' ? (t[k] as string) : ''))
        items.sort((a, b) => (val(a, sort) > val(b, sort) ? -1 : 1))


        const pageSize = limit
        const start = (page - 1) * pageSize
        const paged = items.slice(start, start + pageSize)
        return HttpResponse.json({ items: paged, total: items.length, page, pageSize })
    }),


    http.post('/api/todos', async ({ request }) => {
        await delay(250 + Math.random() * 600); maybeFail()
        const sess = getSessionFromHeader(request.headers)
        if (!sess) return new HttpResponse('Unauthorized', { status: 401 })
        const body = todoSchema.parse(await request.json())
        const now = new Date().toISOString()
        const todo = {
            id: crypto.randomUUID(),
            userId: sess.userId,
            createdAt: now,
            updatedAt: now,
            ...body,
        }
        db.todos.unshift(todo)
        return HttpResponse.json(todo)
    }),


    http.patch('/api/todos/:id', async ({ params, request }) => {
        await delay(250 + Math.random() * 600); maybeFail()
        const sess = getSessionFromHeader(request.headers)
        if (!sess) return new HttpResponse('Unauthorized', { status: 401 })
        const id = params.id as string
        const patch = todoPatchSchema.parse(await request.json())
        const t = db.todos.find(x => x.id === id && x.userId === sess.userId)
        if (!t) return new HttpResponse('Not found', { status: 404 })
        Object.assign(t, patch, { updatedAt: new Date().toISOString() })
        return HttpResponse.json(t)
    }),


    http.delete('/api/todos/:id', async ({ params, request }) => {
        await delay(200 + Math.random() * 500); maybeFail()
        const sess = getSessionFromHeader(request.headers)
        if (!sess) return new HttpResponse('Unauthorized', { status: 401 })
        const id = params.id as string
        db.todos = db.todos.filter(t => !(t.id === id && t.userId === sess.userId))
        return HttpResponse.json({ ok: true, id })
    }),
]