import { NextResponse } from 'next/server';
import { supabase, supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { INITIAL_GALLERY } from '@/lib/mockData';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

// Rota PATCH para persistir as curtidas no banco de dados
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, action } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID da foto é obrigatório' }, { status: 400 });
    }

    const client = supabaseAdmin || supabase;
    if (isSupabaseConfigured && client) {
      const { data: current, error: fetchErr } = await client
        .from('gallery_images')
        .select('likes')
        .eq('id', id)
        .single();

      if (!fetchErr && current) {
        const currentLikes = current.likes || 0;
        const newLikes = action === 'unlike' ? Math.max(0, currentLikes - 1) : currentLikes + 1;

        const { data, error } = await client
          .from('gallery_images')
          .update({ likes: newLikes })
          .eq('id', id)
          .select()
          .single();

        if (!error && data) {
          return NextResponse.json({ success: true, likes: data.likes });
        }
      }
    }

    const item = localGallery.find((g) => g.id === id);
    if (item) {
      item.likes = action === 'unlike' ? Math.max(0, item.likes - 1) : item.likes + 1;
      return NextResponse.json({ success: true, likes: item.likes });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Erro ao atualizar curtidas' }, { status: 500 });
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
      await client.from('comments').delete().eq('image_id', id);

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
