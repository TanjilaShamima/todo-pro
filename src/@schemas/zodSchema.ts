// src/@schemas/zodSchemas.ts
import { z } from 'zod'


export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
})


export const registerSchema = loginSchema.extend({
    name: z.string().min(2)
})


export const todoSchema = z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    status: z.enum(['todo', 'in_progress', 'done']).default('todo'),
    priority: z.enum(['low', 'medium', 'high']).optional().default('medium'),
    tags: z.array(z.string()).optional().default([]),
    dueDate: z.string().datetime().optional(),
})


export const todoPatchSchema = todoSchema.partial()


export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type TodoInput = z.infer<typeof todoSchema>
export type TodoPatchInput = z.infer<typeof todoPatchSchema>