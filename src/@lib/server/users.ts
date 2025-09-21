import { listFiles, readJson, writeJson } from './fsdb';

const USERS_DIR = 'db/users'

export type UserRec = { id: string; name: string; email: string; password: string }

export async function findUserByEmail(email: string) {
    const files = await listFiles(USERS_DIR)
    for (const f of files) {
        const u = await readJson<UserRec>(`${USERS_DIR}/${f}`, null as unknown as UserRec)
        if (u && u.email === email) return u
    }
    return null
}

export async function createUser(input: Omit<UserRec, 'id'>) {
    const id = crypto.randomUUID()
    const rec: UserRec = { id, ...input }
    await writeJson(`${USERS_DIR}/${id}.json`, rec)
    return rec
}
