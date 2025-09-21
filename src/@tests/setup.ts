
import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'


afterEach(() => { cleanup() })

// Mock next/navigation hooks used in components during tests
vi.mock('next/navigation', async () => {
    const actual = await vi.importActual<unknown>('next/navigation') as Record<string, unknown>
    return {
        ...actual,
        useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
    }
})