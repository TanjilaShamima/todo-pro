export const runtime = 'nodejs'
import { createSession } from "@/@lib/server/auth";
import { createUser, findUserByEmail } from "@/@lib/server/users";
import { registerSchema } from "@/@schemas/zodSchema";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        let raw: unknown
        try {
            raw = await req.json()
        } catch {
            return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
        }
        const parsed = registerSchema.safeParse(raw)
        if (!parsed.success) return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
        const body = parsed.data
        const exists = await findUserByEmail(body.email);
        if (exists) return NextResponse.json({ error: "Email exists" }, { status: 409 });
        const user = await createUser({ name: body.name, email: body.email, password: body.password });
        const session = await createSession(user.id);
        return NextResponse.json({ token: session.token, user: { id: user.id, name: user.name, email: user.email } });
    } catch (e) {
        const msg = (e as Error).message ?? "Server error";
        const code = msg.includes("Invalid") || msg.includes("Required") ? 400 : 500;
        if (process.env.NODE_ENV !== 'production') console.error('Auth register error:', e)
        return NextResponse.json({ error: msg }, { status: code });
    }
}
