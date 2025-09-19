export type TodoType = {
    id: string
    title: string
    description?: string
    status: 'todo' | 'in_progress' | 'done'
    priority?: 'low' | 'medium' | 'high'
    tags?: string[]
    dueDate?: string
    createdAt: string
}