
import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'
import { server } from '../../mocks/node' // if you add an msw node server


afterEach(()=>{ cleanup() })