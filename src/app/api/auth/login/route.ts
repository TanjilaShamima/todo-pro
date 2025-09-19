import { NextResponse } from "next/server";
import { usersStore } from "../_store";

type Body = { email: string; password: string };


export async function POST(req: Request) {
    try {
        const { email, password } = (await req.json()) as Body;
        if (!email || !password) return new NextResponse("Invalid body", { status: 400 });
        const user = usersStore.find((u) => u.email === email && u.password === password);
        if (!user) return new NextResponse("Invalid credentials", { status: 401 });
        const token = crypto.randomUUID();
        return NextResponse.json({ token, user: { id: user.id, name: user.name, email: user.email } });
    } catch {
        return new NextResponse("Server error", { status: 500 });
    }
}
