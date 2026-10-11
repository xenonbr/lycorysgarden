-- ==============================================================================
-- LYCORIS GARDEN - SUPABASE DATABASE SCHEMA & MIGRATION SCRIPT
-- ==============================================================================
-- Este script cria todas as tabelas, índices, políticas de segurança (RLS)
-- e dados iniciais para a aplicação web do grupo de VRChat Lycoris Garden.
-- ==============================================================================

-- 1. Habilitar extensão para geração de UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Tabela de Eventos Futuros (events)
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    date DATE NOT NULL,
    time VARCHAR(50) NOT NULL, -- Ex: '21:00 BRT'
    vrchat_world VARCHAR(255) NOT NULL, -- Nome do mundo no VRChat
    world_url VARCHAR(500), -- Link de lançamento no VRChat
    image_url VARCHAR(500), -- Imagem de capa do evento
    category VARCHAR(100) DEFAULT 'Encontro Comunitário', -- Categoria/Tag
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Tabela da Galeria de Fotos (gallery_images)
CREATE TABLE IF NOT EXISTS public.gallery_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    url VARCHAR(1000) NOT NULL,
    author VARCHAR(150) NOT NULL, -- Nickname do fotógrafo/membro
    vrchat_world VARCHAR(255), -- Mundo onde a foto foi tirada
    likes INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Tabela de Comentários das Fotos (comments)
CREATE TABLE IF NOT EXISTS public.comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    image_id UUID NOT NULL REFERENCES public.gallery_images(id) ON DELETE CASCADE,
    author_name VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. Criação de Índices para Alta Performance
CREATE INDEX IF NOT EXISTS idx_events_date ON public.events(date ASC);
CREATE INDEX IF NOT EXISTS idx_gallery_created_at ON public.gallery_images(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_image_id ON public.comments(image_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON public.comments(created_at DESC);

-- 6. Configuração de Row Level Security (RLS)
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Políticas para 'events': Leitura pública para todos; modificação permitida via Service Role
CREATE POLICY "Permitir leitura publica de eventos"
    ON public.events FOR SELECT
    USING (true);

CREATE POLICY "Permitir modificacao de eventos via service_role"
    ON public.events FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Políticas para 'gallery_images': Leitura pública; inserção/exclusão via Service Role
CREATE POLICY "Permitir leitura publica da galeria"
    ON public.gallery_images FOR SELECT
    USING (true);

CREATE POLICY "Permitir modificacao da galeria via service_role"
    ON public.gallery_images FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Políticas para 'comments': Leitura pública; inserção pública (qualquer visitante pode comentar); exclusão via Service Role
CREATE POLICY "Permitir leitura publica de comentarios"
    ON public.comments FOR SELECT
    USING (true);

CREATE POLICY "Permitir insercao publica de comentarios"
    ON public.comments FOR INSERT
    WITH CHECK (length(trim(author_name)) > 0 AND length(trim(content)) > 0);

CREATE POLICY "Permitir exclusao de comentarios via service_role"
    ON public.comments FOR DELETE
    TO service_role
    USING (true);

-- 7. Dados Iniciais de Demonstração (Seed Data)
INSERT INTO public.events (id, title, description, date, time, vrchat_world, world_url, image_url, category) VALUES
(
    '11111111-1111-1111-1111-111111111111',
    'Noite Sob a Lua Carmesim',
    'Encontro social noturno nos campos de Lycoris. Venha com seu avatar favorito em trajes noturnos ou góticos para uma noite de música ambiente e confraternização.',
    CURRENT_DATE + INTERVAL '5 days',
    '21:30 BRT',
    'Garden of the Crimson Moon',
    'https://vrchat.com/home/world/wrld_demo1',
    '/images/banner.jpg',
    'Encontro Oficial'
),
(
    '22222222-2222-2222-2222-222222222222',
    'Sessão de Fotografia & Chill',
    'Exploração de iluminação mística, poses e fotos comunitárias em alta fidelidade. Traga sua criatividade e venha registrar momentos inesquecíveis.',
    CURRENT_DATE + INTERVAL '12 days',
    '22:00 BRT',
    'Sanctuary of Whispering Souls',
    'https://vrchat.com/home/world/wrld_demo2',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop',
    'Fotografia'
),
(
    '33333333-3333-3333-3333-333333333333',
    'Sinfonia do Crepúsculo',
    'Transmissão ao vivo de DJs convidados tocando Synthwave, Dark Ambient e Chillhop diretamente em nossa instância exclusiva.',
    CURRENT_DATE + INTERVAL '19 days',
    '23:00 BRT',
    'Abyssal Pavilion',
    'https://vrchat.com/home/world/wrld_demo3',
    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1200&auto=format&fit=crop',
    'Música Noturna'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.gallery_images (id, title, url, author, vrchat_world, likes) VALUES
(
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'Pétalas ao Vento Carmesim',
    '/images/banner.jpg',
    'Kitsune_VRC',
    'Lycoris Garden Sanctuary',
    42
),
(
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'Reflexos no Lago Escuro',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop',
    'NocturneRose',
    'Midnight Mirror Lake',
    38
),
(
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    'O Portal Esquecido',
    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1200&auto=format&fit=crop',
    'ShadowVeil',
    'Ethereal Shrine',
    29
),
(
    'dddddddd-dddd-dddd-dddd-dddddddddddd',
    'Bailarino das Sombras',
    'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1200&auto=format&fit=crop',
    'VelvetEcho',
    'Crimson Cathedral',
    51
),
(
    'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    'Luar Prateado e Flores Rubras',
    'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?q=80&w=1200&auto=format&fit=crop',
    'Aetheria',
    'Whispering Blossom Path',
    34
),
(
    'ffffffff-ffff-ffff-ffff-ffffffffffff',
    'Chá da Meia-Noite',
    'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?q=80&w=1200&auto=format&fit=crop',
    'KuroNeko',
    'Gothic Tea Haven',
    60
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.comments (id, image_id, author_name, content, created_at) VALUES
(
    uuid_generate_v4(),
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'Aoi_Sakura',
    'Essa foto do evento principal ficou simplesmente mágica! A iluminação das flores de Lycoris é surreal.',
    NOW() - INTERVAL '2 hours'
),
(
    uuid_generate_v4(),
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'Ren_VRC',
    'Mal posso esperar pelo próximo encontro na sexta-feira!',
    NOW() - INTERVAL '45 minutes'
),
(
    uuid_generate_v4(),
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'LilithGoth',
    'Que composição linda no lago! Parabéns pela captura NocturneRose.',
    NOW() - INTERVAL '1 hour'
);
