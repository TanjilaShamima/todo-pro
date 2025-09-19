export type UserRec = { id: string; name: string; email: string; password: string };

// Simple in-memory store shared between route modules (same process)
export const usersStore: UserRec[] = [];
