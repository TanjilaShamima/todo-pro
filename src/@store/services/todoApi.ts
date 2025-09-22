import { getToken } from '@/@lib/tokens';
import { TodoInput } from '@/@schemas/zodSchema';
import { TodoType } from '@/@types/todo';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';



export type ListParams = { page?: number; limit?: number | 'all'; q?: string; status?: TodoType['status'] | 'all'; sort?: 'createdAt' | 'dueDate' | 'priority' }
export type Paginated<T> = { items: T[]; page: number; pageSize: number; total: number }

export const todosApi = createApi({
    reducerPath: 'todosApi',
    baseQuery: fetchBaseQuery({
        baseUrl: '/api',
        prepareHeaders(headers) {
            const token = getToken(); if (token) headers.set('authorization', `Bearer ${token}`)
            return headers
        }
    }),
    tagTypes: ['Todos'],
    endpoints: (b) => ({
        listTodos: b.query<Paginated<TodoType>, ListParams | void>({
            query: (p) => ({ url: '/todos', params: { limit: 10, ...(p || {}) } }),
            providesTags: (res) => res?.items ? [
                ...res.items.map(t => ({ type: 'Todos' as const, id: t.id })),
                { type: 'Todos' as const, id: 'LIST' }
            ] : [{ type: 'Todos' as const, id: 'LIST' }]
        }),
        getTodo: b.query<TodoType, string>({ query: (id) => `/todos/${id}` }),
        createTodo: b.mutation<TodoType, TodoInput>({
            query: (body) => ({ url: '/todos', method: 'POST', body }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                const patch = dispatch(
                    todosApi.util.updateQueryData('listTodos', undefined, (draft) => {
                        const optimistic: TodoType = { id: 'opt-' + crypto.randomUUID(), createdAt: new Date().toISOString(), ...arg }
                        draft.items.unshift(optimistic)
                        draft.total += 1
                    })
                )
                try { await queryFulfilled } catch { patch.undo() }
            },
            invalidatesTags: [{ type: 'Todos', id: 'LIST' }]
        }),
        updateTodo: b.mutation<TodoType, Partial<TodoType> & { id: string }>({
            query: ({ id, ...patch }) => ({ url: `/todos/${id}`, method: 'PATCH', body: patch }),
            async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    todosApi.util.updateQueryData('listTodos', undefined, (draft) => {
                        const t = draft.items.find(i => i.id === id); if (t) Object.assign(t, patch)
                    })
                )
                try { await queryFulfilled } catch { patchResult.undo() }
            },
            invalidatesTags: (r, e, arg) => [{ type: 'Todos', id: arg.id }]
        }),
        deleteTodo: b.mutation<{ ok: true; id: string }, string>({
            query: (id) => ({ url: `/todos/${id}`, method: 'DELETE' }),
            async onQueryStarted(id, { dispatch, queryFulfilled }) {
                const patch = dispatch(
                    todosApi.util.updateQueryData('listTodos', undefined, (draft) => {
                        draft.items = draft.items.filter(i => i.id !== id); draft.total -= 1
                    })
                )
                try { await queryFulfilled } catch { patch.undo() }
            },
            invalidatesTags: (r, e, id) => [{ type: 'Todos', id }]
        }),
    })
})


export const { useListTodosQuery, useGetTodoQuery, useCreateTodoMutation, useUpdateTodoMutation, useDeleteTodoMutation } = todosApi