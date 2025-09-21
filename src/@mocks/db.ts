import { TodoType } from '@/@types/todo';
export type User = { id: string; name: string; email: string; password: string }
export type Session = { token: string; userId: string; exp: number }

export const db = {
    users: [] as User[],
    todos: [] as TodoType[],
    sessions: [] as Session[],
}

// Acceptance prefers empty initial todos per user

export const delay = (ms: number) => new Promise(r => setTimeout(r, ms))
export function maybeFail() { /* disabled random failure for deterministic dev */ }

export function createSession(userId: string): Session {
    const token = crypto.randomUUID()
    const exp = Date.now() + 24 * 60 * 60 * 1000
    const s: Session = { token, userId, exp }
    db.sessions.push(s)
    return s
}

export function getSessionFromHeader(h: Headers): Session | null {
    const auth = h.get('authorization') || ''
    const token = auth.startsWith('Bearer ') ? auth.split(' ')[1] : ''
    if (!token) return null
    const s = db.sessions.find(x => x.token === token) || null
    if (!s || Date.now() > s.exp) return null
    return s
}