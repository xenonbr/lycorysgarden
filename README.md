# 🌸 Lycoris Garden - VRChat Community Web Platform

Aplicação web oficial da comunidade do VRChat **Lycoris Garden**. Desenvolvida com Next.js (App Router), TypeScript, Tailwind CSS e integração em tempo real com Supabase (PostgreSQL).

![Lycoris Garden Banner](/public/images/banner.jpg)

---

## 🎨 Identidade Visual (Brandkit)
- **Tema:** *Lycoris Radiata* (Red Spider Lily), estética gótica sutil, mística e noturna.
- **Paleta de Cores:**
  - Cor Primária (Acento): Carmesim Lycoris (`#E11D48` / `#990C1A`)
  - Fundo & Superfícies: Preto profundo (`#080808`, `#0E0E12`, `#121217`)
  - Acentos Secundários: Dourado Pólen (`#DAAF37`), Cinza Místico (`#71717A`, `#27272A`)
  - Verde Folhagem: `#2C4736`
- **Tipografia:** `Cinzel Decorative` para títulos e `Inter` para leitura moderna.
- **Efeitos:** Partículas interativas de pétalas no Canvas, glow carmesim e cartões translúcidos com efeito de vidro.

---

## 🚀 Funcionalidades

1. **Página Principal (Landing Page):**
   - **Hero Cinematográfico:** Banner em alta definição com efeito de vinheta, slogan da marca e CTA com link direto para filiação no grupo do VRChat (`https://vrc.group/LYCORI.7672`).
   - **Mural de Eventos Futuros:** Listagem dinâmica com datas, horários, mundos do VRChat, botão para copiar links de instâncias e lançar mundos.
   - **Galeria Comunitária Interativa:** Grid masonry responsivo com lightbox de tela cheia, curtidas e sistema de comentários em tempo real.
   - **Apoiadores Oficiais:** Bloco em homenagem aos projetos [LupratuVR](https://lupratuvr.vercel.app/) e [Ph4nt0m](https://ph4nt0m.carrd.co/).
   - **Rodapé:** Regras de convivência, links e créditos da comunidade.

2. **Painel Administrativo (`/admin`):**
   - Rota protegida por autenticação com senha mestra (`ADMIN_PASSWORD`).
   - CRUD de Eventos: Crie, visualize e remova eventos da comunidade.
   - Gerenciamento de Fotos da Galeria: Adicione links de imagens ou dispare sincronizações de feeds via Webhook (Google Drive, Cloudinary ou Supabase Storage).
   - Fila de Moderação de Comentários: Exclusão imediata de comentários impróprios deixados na galeria.

---

## 🛠️ Stack Tecnológica

- **Framework:** Next.js 15+ (App Router)
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS + Lucide Icons + Framer Motion
- **Banco de Dados:** Supabase (PostgreSQL gratuito) com RLS ativado
- **Deploy:** Otimizado para Vercel (Edge Runtime e ISR)

---

## 📦 Estrutura de Arquivos

```text
lycoris-garden-web/
├── app/
│   ├── admin/
│   │   └── page.tsx              # Painel Administrativo funcional
│   ├── api/
│   │   ├── auth/
│   │   │   └── route.ts          # Rota de autenticação da senha mestra
│   │   ├── comments/
│   │   │   └── route.ts          # Rota de comentários da galeria
│   │   ├── events/
│   │   │   └── route.ts          # Rota de eventos do VRChat
│   │   └── gallery/
│   │       └── route.ts          # Rota da galeria e webhook de feed
│   ├── globals.css               # Estilos globais e scrollbar gótica
│   ├── layout.tsx                # Layout raiz com fontes Cinzel e Inter
│   └── page.tsx                  # Landing page completa
├── components/
│   ├── EventsSection.tsx         # Painel de eventos com cópia de link
│   ├── Footer.tsx                # Rodapé com regras e links sociais
│   ├── GallerySection.tsx        # Grid masonry com lightbox e comentários
│   ├── Hero.tsx                  # Banner cinematográfico e CTA do VRChat
│   ├── LycorisParticles.tsx      # Partículas interativas de pétalas
│   ├── Navbar.tsx                # Cabeçalho com monograma e navegação
│   └── SupportersSection.tsx     # Seção de apoiadores oficiais
├── lib/
│   ├── mockData.ts               # Dados iniciais para funcionamento imediato
│   ├── supabase.ts               # Cliente Supabase tipado
│   └── types.ts                  # Interfaces TypeScript
├── public/
│   └── images/
│       ├── banner.jpg            # Banner oficial fornecido
│       └── brand-guide.jpg       # Guia de marca oficial
├── supabase/
│   └── schema.sql                # Script SQL completo de criação e seed
├── .env.example                  # Modelo de variáveis de ambiente
├── next.config.mjs               # Configuração do Next.js
├── package.json                  # Dependências do projeto
├── postcss.config.mjs            # Configuração do PostCSS
├── tailwind.config.ts            # Configuração das cores e fontes Lycoris
└── tsconfig.json                 # Configuração do TypeScript
```

---

## ⚙️ Passo a Passo para Subir no GitHub e Publicar na Vercel

### 1. Preparar o Banco no Supabase (Gratuito)
1. Acesse [supabase.com](https://supabase.com) e crie um novo projeto.
2. No menu lateral, acesse **SQL Editor**.
3. Copie todo o conteúdo do arquivo `supabase/schema.sql` e execute o script.
4. Vá em **Project Settings > API** e copie:
   - `Project URL`
   - `anon public key`
   - `service_role secret key`

### 2. Inicializar o Repositório Git Localmente
```bash
cd lycoris-garden-web
git init
git add .
git commit -m "feat: initial commit - Lycoris Garden web app"
```

### 3. Subir no GitHub
1. Crie um novo repositório no seu GitHub chamado `lycoris-garden-web`.
2. Vincule e envie o código:
```bash
git remote add origin https://github.com/SEU_USUARIO/lycoris-garden-web.git
git branch -M main
git push -u origin main
```

### 4. Deploy Direto na Vercel
1. Acesse [vercel.com](https://vercel.com) e faça login com sua conta do GitHub.
2. Clique em **Add New > Project** e importe o repositório `lycoris-garden-web`.
3. Na seção **Environment Variables**, adicione as variáveis de ambiente:
   - `NEXT_PUBLIC_SUPABASE_URL`: Sua URL do Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Sua chave anônima do Supabase
   - `SUPABASE_SERVICE_ROLE_KEY`: Sua chave de service_role do Supabase
   - `ADMIN_PASSWORD`: A senha mestra que deseja usar para o `/admin` (ex: `LycorisAdmin2026!#Secure`)
   - `NEXT_PUBLIC_SITE_URL`: A URL do seu domínio na Vercel
4. Clique em **Deploy**.
5. Em menos de 2 minutos sua aplicação estará online com certificado SSL gratuito e alta velocidade global!
