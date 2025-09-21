import { listFiles, readJson, writeJson } from './fsdb'

const TODOS_DIR = 'db/todos'

export type TodoRec = {
    id: string
    userId: string
    title: string
    description?: string
    status: 'todo' | 'in_progress' | 'done'
    priority?: 'low' | 'medium' | 'high'
    tags?: string[]
    dueDate?: string
    createdAt: string
    updatedAt: string
}

export type ListParams = { userId: string; page?: number; limit?: number; q?: string; status?: TodoRec['status'] | 'all'; sort?: 'createdAt' | 'dueDate' | 'priority' }

export async function listTodos({ userId, page = 1, limit = 10, q = '', status = 'all', sort = 'createdAt' }: ListParams) {
    const files = await listFiles(TODOS_DIR)
    let items: TodoRec[] = []
    for (const f of files) {
        const t = await readJson<TodoRec>(`${TODOS_DIR}/${f}`, null as unknown as TodoRec)
        if (t && t.userId === userId) items.push(t)
    }
    const ql = q.toLowerCase()
    if (ql) items = items.filter(t => `${t.title} ${t.description ?? ''}`.toLowerCase().includes(ql))
    if (status !== 'all') items = items.filter(t => t.status === status)
    items.sort((a, b) => (a[sort] as string) > (b[sort] as string) ? -1 : 1)

    const start = (page - 1) * limit
    const paged = items.slice(start, start + limit)
    return { items: paged, total: items.length, page, pageSize: limit }
}

export async function getTodo(userId: string, id: string) {
    const t = await readJson<TodoRec>(`${TODOS_DIR}/${id}.json`, null as unknown as TodoRec)
    return t && t.userId === userId ? t : null
}

export async function createTodo(userId: string, input: Omit<TodoRec, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) {
    const id = crypto.randomUUID()
    const now = new Date().toISOString()
    const rec: TodoRec = { id, userId, createdAt: now, updatedAt: now, ...input }
    await writeJson(`${TODOS_DIR}/${id}.json`, rec)
    return rec
}

export async function updateTodo(userId: string, id: string, patch: Partial<Omit<TodoRec, 'id' | 'userId' | 'createdAt'>>) {
    const cur = await getTodo(userId, id)
    if (!cur) return null
    const now = new Date().toISOString()
    const rec = { ...cur, ...patch, updatedAt: now }
    await writeJson(`${TODOS_DIR}/${id}.json`, rec)
    return rec
}

export async function deleteTodo(userId: string, id: string) {
    const cur = await getTodo(userId, id)
    if (!cur) return false
    await writeJson(`${TODOS_DIR}/${id}.json`, { deleted: true, at: Date.now() })
    return true
}
