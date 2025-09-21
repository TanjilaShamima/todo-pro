// src/store/slices/todoSlice.ts
import { getToken } from '@/@lib/tokens'
import { TodoInput } from '@/@schemas/zodSchema'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'


export type Todo = {
  id: string
  title: string
  description?: string
  status: 'todo' | 'in_progress' | 'done'
  priority?: 'low' | 'medium' | 'high'
  dueDate?: string
  createdAt: string
}

type TodosState = {
  items: Todo[]
  loading: boolean
  error: string | null
}

const initialState: TodosState = { items: [], loading: false, error: null }

// Thunks (using fetch with mock API)
export const fetchTodos = createAsyncThunk('todos/fetchTodos', async () => {
  const token = getToken()
  const res = await fetch('/api/todos', {
    headers: token ? { authorization: `Bearer ${token}` } : undefined,
  })
  if (!res.ok) throw new Error('Failed to fetch')
  return (await res.json()).items as Todo[]
})

export const createTodo = createAsyncThunk('todos/createTodo', async (todo: TodoInput) => {
  const token = getToken()
  const res = await fetch('/api/todos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(todo),
  })
  if (!res.ok) throw new Error('Failed to create')
  return (await res.json()) as Todo
})

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    clearTodos: (s) => {
      s.items = []
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (s) => {
        s.loading = true
      })
      .addCase(fetchTodos.fulfilled, (s, a: PayloadAction<Todo[]>) => {
        s.loading = false
        s.items = a.payload
      })
      .addCase(fetchTodos.rejected, (s, a) => {
        s.loading = false
        s.error = a.error.message ?? 'Error'
      })
      .addCase(createTodo.fulfilled, (s, a: PayloadAction<Todo>) => {
        s.items.unshift(a.payload)
      })
  },
})

export const { clearTodos } = todosSlice.actions
export default todosSlice.reducer
