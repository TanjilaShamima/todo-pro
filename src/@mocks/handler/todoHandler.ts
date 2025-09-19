import { http, HttpResponse } from 'msw'
import { db, delay, maybeFail } from '../db'


export const todoHandlers = [
    http.get('/api/todos', async ({ request }) => {
        await delay(200 + Math.random() * 500); maybeFail()
        const url = new URL(request.url)
        const page = Number(url.searchParams.get('page') ?? 1)
        const q = (url.searchParams.get('q') ?? '').toLowerCase()
        const status = url.searchParams.get('status') ?? 'all'
        const sort = url.searchParams.get('sort') ?? 'createdAt'


        let items = [...db.todos]
        if (q) items = items.filter(t => (t.title + t.description).toLowerCase().includes(q))
        if (status !== 'all') items = items.filter(t => t.status === status)
        items.sort((a, b) => (a[sort] > b[sort] ? -1 : 1))


        const pageSize = 10
        const start = (page - 1) * pageSize
        const paged = items.slice(start, start + pageSize)
        return HttpResponse.json({ items: paged, total: items.length, page, pageSize })
    }),


    http.post('/api/todos', async ({ request }) => {
        await delay(250 + Math.random() * 600); maybeFail()
        const body = await request.json() as any
        const todo = { id: crypto.randomUUID(), createdAt: new Date().toISOString(), ...body }
        db.todos.unshift(todo)
        return HttpResponse.json(todo)
    }),


    http.patch('/api/todos/:id', async ({ params, request }) => {
        await delay(250 + Math.random() * 600); maybeFail()
        const id = params.id as string
        const patch = await request.json() as any
        const t = db.todos.find(x => x.id === id)
        if (!t) return new HttpResponse('Not found', { status: 404 })
        Object.assign(t, patch)
        return HttpResponse.json(t)
    }),


    http.delete('/api/todos/:id', async ({ params }) => {
        await delay(200 + Math.random() * 500); maybeFail()
        const id = params.id as string
        db.todos = db.todos.filter(t => t.id !== id)
        return HttpResponse.json({ ok: true, id })
    }),
]