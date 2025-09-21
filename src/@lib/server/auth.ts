import { readJson, writeJson } from './fsdb';

const SESS_DIR = 'db/sessions'

export type SessionRec = { token: string; userId: string; exp: number }

export async function createSession(userId: string): Promise<SessionRec> {
    const token = crypto.randomUUID()
    const exp = Date.now() + 24 * 60 * 60 * 1000
    const rec: SessionRec = { token, userId, exp }
    await writeJson(`${SESS_DIR}/${token}.json`, rec)
    return rec
}

export async function getSession(token?: string | null): Promise<SessionRec | null> {
    if (!token) return null
    const rec = await readJson<SessionRec | null>(`${SESS_DIR}/${token}.json`, null)
    if (!rec) return null
    if (Date.now() > rec.exp) return null
    return rec
}

export async function destroySession(token?: string | null) {
    try {
        if (!token) return
        await writeJson(`${SESS_DIR}/${token}.json`, { revoked: true, at: Date.now() })
    } catch { /* ignore */ }
}

export async function requireAuth(authorization?: string | null): Promise<{ userId: string }> {
    if (!authorization) throw new Error('Unauthorized')
    const parts = authorization.split(' ')
    const token = parts.length === 2 ? parts[1] : null
    const sess = await getSession(token)
    if (!sess) throw new Error('Unauthorized')
    return { userId: sess.userId }
}
