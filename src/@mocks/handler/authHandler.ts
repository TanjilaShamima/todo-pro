import { loginSchema, registerSchema } from '@/@schemas/zodSchema';
import { http, HttpResponse } from 'msw';
import { createSession, db, delay, maybeFail } from '../db';


export const authHandlers = [
    http.post('/api/auth/register', async ({ request }) => {
        await delay(400 + Math.random() * 800); maybeFail()
        const body = registerSchema.parse(await request.json())
        const exists = db.users.find(u => u.email === body.email)
        if (exists) return new HttpResponse('Email exists', { status: 409 })
        const user = { id: crypto.randomUUID(), ...body }
        db.users.push(user)
        const sess = createSession(user.id)
        return HttpResponse.json({ token: sess.token, user: { id: user.id, name: user.name, email: user.email } })
    }),
    http.post('/api/auth/login', async ({ request }) => {
        await delay(300 + Math.random() * 600); maybeFail()
        const { email, password } = loginSchema.parse(await request.json())
        const user = db.users.find(u => u.email === email && u.password === password)
        if (!user) return new HttpResponse('Invalid credentials', { status: 401 })
        const sess = createSession(user.id)
        return HttpResponse.json({ token: sess.token, user: { id: user.id, name: user.name, email: user.email } })
    })
]