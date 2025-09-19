// mocks/browser.ts
import { setupWorker } from 'msw/browser'
import { todoHandlers } from './handler/todoHandler'
import { authHandlers } from './handler/authHandler'



export const worker = setupWorker(...authHandlers, ...todoHandlers)