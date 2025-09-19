export type TokenRecord = { token: string; exp: number } // epoch ms


const KEY = 'todo_pro_auth'
export function saveToken(token: string, ttlMinutes = 60) {
    const rec: TokenRecord = { token, exp: Date.now() + ttlMinutes * 60_000 }
    localStorage.setItem(KEY, JSON.stringify(rec))
}
export function getToken(): string | null {
    try {
        const raw = localStorage.getItem(KEY)
        if (!raw) return null
        const rec = JSON.parse(raw) as TokenRecord
        if (Date.now() > rec.exp) {
            localStorage.removeItem(KEY)
            return null
        }
        return rec.token
    } catch { return null }
}
export function clearToken() { localStorage.removeItem(KEY) }
export function isAuthed() { return !!getToken() }