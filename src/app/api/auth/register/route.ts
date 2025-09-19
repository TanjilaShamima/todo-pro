import { NextResponse } from "next/server";
import { usersStore } from "../_store";

type Body = { name: string; email: string; password: string };


export async function POST(req: Request) {
    try {
        const body = (await req.json()) as Body;
        if (!body.name || !body.email || !body.password)
            return new NextResponse("Invalid body", { status: 400 });
        const exists = usersStore.find((u) => u.email === body.email);
        if (exists) return new NextResponse("Email exists", { status: 409 });
        const user = { id: crypto.randomUUID(), ...body };
        usersStore.push(user);
        const token = crypto.randomUUID();
        return NextResponse.json({ token, user: { id: user.id, name: user.name, email: user.email } });
    } catch {
        return new NextResponse("Server error", { status: 500 });
    }
}
