import { promises as fs } from 'node:fs'
import { dirname } from 'node:path'

export async function ensureDir(path: string) {
    await fs.mkdir(path, { recursive: true })
}

export async function readJson<T>(path: string, fallback: T): Promise<T> {
    try {
        const buf = await fs.readFile(path, 'utf8')
        // Gracefully handle empty files or whitespace-only content
        if (!buf || buf.trim() === '') return fallback
        try {
            return JSON.parse(buf) as T
        } catch {
            // If the JSON is malformed, return fallback instead of throwing
            if (process.env.NODE_ENV !== 'production') {
                console.warn(`[fsdb] Invalid JSON in ${path}, returning fallback`)
            }
            return fallback
        }
    } catch (e: unknown) {
        const err = e as { code?: string }
        // Common cases: file not found, invalid arg, or reading a dir
        if (err && (err.code === 'ENOENT' || err.code === 'ERR_INVALID_ARG_VALUE' || err.code === 'EISDIR')) return fallback
        throw e
    }
}

export async function writeJson(path: string, data: unknown) {
    await ensureDir(dirname(path))
    await fs.writeFile(path, JSON.stringify(data, null, 2), 'utf8')
}

export async function listFiles(dir: string) {
    try { return await fs.readdir(dir) } catch { return [] }
}
