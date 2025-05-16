import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const { password } = await request.json();
    if (password === 'inU&I') {
        return NextResponse.json({ success: true });
    }
    return NextResponse.json({ success: false });
}
