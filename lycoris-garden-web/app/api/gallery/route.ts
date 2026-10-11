import { NextResponse } from 'next/server';
import { supabase, supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { INITIAL_GALLERY } from '@/lib/mockData';

let localGallery = [...INITIAL_GALLERY];

export async function GET() {
  const client = supabaseAdmin || supabase;
  if (isSupabaseConfigured && client) {
    const { data, error } = await client
      .from('gallery_images')
      .select('*, comments(*)')
      .order('created_at', { ascending: false });

    if (!error && data) {
      return NextResponse.json(data);
    }
  }

  return NextResponse.json(localGallery);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = body.data || body;

    if (!payload.url || !payload.title) {
      return NextResponse.json({ error: 'URL e Título são obrigatórios' }, { status: 400 });
    }

    const newImage = {
      id: crypto.randomUUID(),
      title: payload.title,
      url: payload.url,
      author: payload.author || 'Membro do Lycoris',
      vrchat_world: payload.vrchat_world || 'Lycoris Garden Sanctuary',
      likes: payload.likes || 0,
      created_at: new Date().toISOString(),
    };

    const client = supabaseAdmin || supabase;
    if (isSupabaseConfigured && client) {
      const { data, error } = await client
        .from('gallery_images')
        .insert([newImage])
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
      return NextResponse.json(data, { status: 201 });
    }

    localGallery.unshift({ ...newImage, comments: [] });
    return NextResponse.json(newImage, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Erro ao adicionar imagem' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID da foto é obrigatório' }, { status: 400 });
    }

    const client = supabaseAdmin || supabase;
    if (isSupabaseConfigured && client) {
      // 1. Remove primeiro os comentários da foto para não travar na chave estrangeira
      await client.from('comments').delete().eq('image_id', id);

      // 2. Remove a imagem com privilégio administrativo (service_role)
      const { error } = await client.from('gallery_images').delete().eq('id', id);
      if (error) {
        console.error('Erro Supabase ao excluir foto:', error);
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
      return NextResponse.json({ success: true });
    }

    localGallery = localGallery.filter((img) => img.id !== id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Erro ao excluir imagem' }, { status: 500 });
  }
}
