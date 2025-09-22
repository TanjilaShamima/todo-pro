import { promises as fs } from 'node:fs'
import { dirname } from 'node:path'

// Detect if we should use a writable tmp dir (e.g., Vercel serverless/edge runtime)
const TMP_ROOT = process.env.TMPDIR || '/tmp'
const USE_TMP = !!TMP_ROOT

// Any path under public/db should be redirected to /tmp/db at runtime when USE_TMP is true.
function resolveWritePath(path: string) {
    if (USE_TMP && path.startsWith('public/db')) {
        return path.replace(/^public\/(db.*)$/i, `${TMP_ROOT}/$1`)
    }
    return path
}

function resolveReadPath(path: string) {
    // Prefer tmp path if available; fall back to original public path when missing
    if (USE_TMP && path.startsWith('public/db')) {
        return path.replace(/^public\/(db.*)$/i, `${TMP_ROOT}/$1`)
    }
    return path
}

function resolveListDir(dir: string) {
    if (USE_TMP && dir.startsWith('public/db')) {
        return dir.replace(/^public\/(db.*)$/i, `${TMP_ROOT}/$1`)
    }
    return dir
}

export async function ensureDir(path: string) {
    const p = resolveWritePath(path)
    await fs.mkdir(p, { recursive: true })
}

export async function readJson<T>(path: string, fallback: T): Promise<T> {
    // Try tmp-resolved path first (if applicable), then fall back to original path under public
    const candidates = Array.from(new Set([
        resolveReadPath(path),
        path,
    ]))
    for (const p of candidates) {
        try {
            const buf = await fs.readFile(p, 'utf8')
            if (!buf || buf.trim() === '') continue
            try {
                return JSON.parse(buf) as T
            } catch {
                if (process.env.NODE_ENV !== 'production') {
                    console.warn(`[fsdb] Invalid JSON in ${p}, returning fallback`)
                }
                continue
            }
        } catch (e: unknown) {
            const err = e as { code?: string }
            if (err && (err.code === 'ENOENT' || err.code === 'ERR_INVALID_ARG_VALUE' || err.code === 'EISDIR')) {
                // try next candidate
                continue
            }
            // non-ignorable error, rethrow
            throw e
        }
    }
    return fallback
}

export async function writeJson(path: string, data: unknown) {
    const p = resolveWritePath(path)
    await ensureDir(dirname(p))
    await fs.writeFile(p, JSON.stringify(data, null, 2), 'utf8')
}

export async function listFiles(dir: string) {
    const primary = resolveListDir(dir)
    const fallbacks = [dir]
    try {
        return await fs.readdir(primary)
    } catch {
        for (const d of fallbacks) {
            try { return await fs.readdir(d) } catch { /* try next */ }
        }
        return []
    }
}
