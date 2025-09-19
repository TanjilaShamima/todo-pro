import { TodoType } from '@/@types/todo';
import { faker } from '@faker-js/faker'
export type User = { id: string; name: string; email: string; password: string }
export const db = {
    users: [] as User[],
    todos: [] as TodoType[]
}


// seed
for (let i = 0; i < 20; i++) {
    db.todos.push({
        id: faker.string.uuid(),
        title: faker.hacker.verb() + ' ' + faker.hacker.noun(),
        description: faker.hacker.phrase(),
        status: faker.helpers.arrayElement(['todo', 'in_progress', 'done']),
        priority: faker.helpers.arrayElement(['low', 'medium', 'high']),
        tags: faker.helpers.arrayElements(['work', 'home', 'urgent', 'later'], { min: 0, max: 3 }),
        dueDate: faker.date.soon().toISOString(),
        createdAt: faker.date.recent().toISOString()
    })
}


export const delay = (ms: number) => new Promise(r => setTimeout(r, ms))
export function maybeFail() { if (Math.random() < 0.12) { const e = new Error('Random failure'); (e as any).status = 500; throw e } }