import path from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: path.resolve(__dirname, 'src/@tests/setup.ts'),
        include: ['src/**/*.spec.ts', 'src/**/*.spec.tsx'],
    },
    esbuild: {
        jsx: 'automatic',
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
})
