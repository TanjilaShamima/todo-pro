// src/components/todos/TodoList.tsx
'use client'
import { useListTodosQuery } from '@/@store/services/todoApi';
import TodoItem from './TodoItem'


type Props = { page: number; q?: string; status?: string; sort?: string }

export default function TodoList({ page, q = '', status = '', sort = 'createdAt' }: Props) {
  const { data, isLoading, isError } = useListTodosQuery({ page, q, status, sort })

  if (isLoading) return <p>Loading todos…</p>
  if (isError) return <p className="text-red-600">Failed to load todos</p>
  if (!data || data.items.length === 0) return <p>No todos found.</p>

  return (
    <ul className="space-y-3">
      {data.items.map((t) => (
        <TodoItem key={t.id} todo={t} />
      ))}
    </ul>
  )
}
