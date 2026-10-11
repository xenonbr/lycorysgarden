import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const correctPassword = process.env.ADMIN_PASSWORD || 'LycorisAdmin2026!';

    if (password === correctPassword) {
      return NextResponse.json({ authenticated: true, message: 'Autenticado com sucesso' });
    }

    return NextResponse.json({ authenticated: false, message: 'Senha incorreta' }, { status: 401 });
  } catch (err) {
    return NextResponse.json({ error: 'Erro no servidor' }, { status: 500 });
  }
}
