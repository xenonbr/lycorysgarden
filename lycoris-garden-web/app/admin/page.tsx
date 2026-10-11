"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Shield,
  Lock,
  Calendar,
  Image as ImageIcon,
  MessageSquare,
  Plus,
  Trash2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  LogOut,
  RefreshCw,
  Sparkles,
  Radio,
} from 'lucide-react';
import { VRChatEvent, GalleryImage, CommentItem } from '@/lib/types';
import { INITIAL_EVENTS, INITIAL_GALLERY } from '@/lib/mockData';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<'events' | 'gallery' | 'comments'>('events');

  // Estados de dados
  const [events, setEvents] = useState<VRChatEvent[]>(INITIAL_EVENTS);
  const [gallery, setGallery] = useState<GalleryImage[]>(INITIAL_GALLERY);
  const [allComments, setAllComments] = useState<CommentItem[]>([]);
  const [notification, setNotification] = useState<string | null>(null);

  // Formulário de Novo Evento
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '21:30 BRT',
    vrchat_world: '',
    world_url: '',
    category: 'Encontro Oficial',
  });

  // Formulário de Nova Foto na Galeria
  const [galleryForm, setGalleryForm] = useState({
    title: '',
    url: '',
    author: '',
    vrchat_world: 'Lycoris Garden Sanctuary',
  });

  // Teste de Webhook / Feed Automático
  const [webhookUrlInput, setWebhookUrlInput] = useState('');
  const [webhookStatus, setWebhookStatus] = useState<string | null>(null);

  useEffect(() => {
    const savedAuth = sessionStorage.getItem('lycoris_admin_auth');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
      fetchDashboardData();
    }
  }, []);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput }),
      });

      if (res.ok) {
        setIsAuthenticated(true);
        sessionStorage.setItem('lycoris_admin_auth', 'true');
        fetchDashboardData();
      } else {
        setAuthError('Senha incorreta. Verifique o valor de ADMIN_PASSWORD no .env');
      }
    } catch (err) {
      setAuthError('Erro ao comunicar com o servidor');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('lycoris_admin_auth');
    setIsAuthenticated(false);
    setPasswordInput('');
  };

  const fetchDashboardData = async () => {
    try {
      const [resEv, resGal, resComm] = await Promise.all([
        fetch('/api/events'),
        fetch('/api/gallery'),
        fetch('/api/comments'),
      ]);

      if (resEv.ok) setEvents(await resEv.json());
      if (resGal.ok) setGallery(await resGal.json());
      if (resComm.ok) setAllComments(await resComm.json());
    } catch (err) {
      console.warn('Erro ao atualizar dados do painel:', err);
    }
  };

  // Criar Evento
  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventForm),
      });

      if (res.ok) {
        const created = await res.json();
        setEvents((prev) => [created, ...prev]);
        setEventForm({
          title: '',
          description: '',
          date: '',
          time: '21:30 BRT',
          vrchat_world: '',
          world_url: '',
          category: 'Encontro Oficial',
        });
        showToast('Evento criado com sucesso!');
      }
    } catch (err) {
      showToast('Erro ao criar evento');
    }
  };

  // Excluir Evento
  const handleDeleteEvent = async (id: string) => {
    if (!confirm('Deseja realmente excluir este evento?')) return;
    try {
      const res = await fetch('/api/events?id=' + id, { method: 'DELETE' });
      if (res.ok) {
        setEvents((prev) => prev.filter((e) => e.id !== id));
        showToast('Evento excluído');
      }
    } catch (err) {
      showToast('Erro ao excluir');
    }
  };

  // Adicionar Foto
  const handleAddGalleryImage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(galleryForm),
      });

      if (res.ok) {
        const created = await res.json();
        setGallery((prev) => [created, ...prev]);
        setGalleryForm({
          title: '',
          url: '',
          author: '',
          vrchat_world: 'Lycoris Garden Sanctuary',
        });
        showToast('Foto adicionada à galeria!');
      }
    } catch (err) {
      showToast('Erro ao adicionar foto');
    }
  };

  // Excluir Foto
  const handleDeleteGallery = async (id: string) => {
    if (!confirm('Deseja remover esta foto da galeria?')) return;
    try {
      const res = await fetch('/api/gallery?id=' + id, { method: 'DELETE' });
      if (res.ok) {
        setGallery((prev) => prev.filter((g) => g.id !== id));
        showToast('Foto removida');
      }
    } catch (err) {
      showToast('Erro ao excluir');
    }
  };

  // Excluir Comentário (Moderação)
  const handleDeleteComment = async (id: string) => {
    if (!confirm('Excluir este comentário da comunidade?')) return;
    try {
      const res = await fetch('/api/comments?id=' + id, { method: 'DELETE' });
      if (res.ok) {
        setAllComments((prev) => prev.filter((c) => c.id !== id));
        showToast('Comentário moderado e removido');
      }
    } catch (err) {
      showToast('Erro ao moderar comentário');
    }
  };

  // Simulação / Teste do Webhook de Feed Automático de Fotos
  const handleTriggerWebhookTest = async () => {
    setWebhookStatus('Sincronizando feed de fotos...');
    try {
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'photo_uploaded',
          data: {
            title: 'Sincronização Noturna Automática',
            url:
              webhookUrlInput.trim() ||
              'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop',
            author: 'Feed_Webhook_Bot',
            vrchat_world: 'Santuário de Lycoris Radiata',
          },
        }),
      });

      if (res.ok) {
        setWebhookStatus('Foto importada com sucesso via Webhook!');
        fetchDashboardData();
        setWebhookUrlInput('');
      } else {
        setWebhookStatus('Falha ao processar webhook');
      }
    } catch (err) {
      setWebhookStatus('Erro ao executar sincronização');
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-gothic-bg flex items-center justify-center p-4">
        <div className="max-w-md w-full rounded-2xl bg-zinc-950 border border-lycoris-900/60 p-8 shadow-lycoris-glow space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-lycoris-950 border border-lycoris-700 mx-auto flex items-center justify-center text-lycoris-400">
              <Shield className="w-6 h-6" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-white tracking-wide">
              Acesso <span className="text-lycoris-500">Administrativo</span>
            </h1>
            <p className="text-xs text-zinc-400">
              Painel de moderação e gerenciamento da comunidade Lycoris Garden
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                Senha Mestra
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="Digite sua senha de administrador..."
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full px-4 py-3 text-sm rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-lycoris-500"
                />
                <Lock className="w-4 h-4 text-zinc-500 absolute right-3.5 top-3.5" />
              </div>
            </div>

            {authError && (
              <div className="p-3 rounded-lg bg-red-950/60 border border-red-800 text-xs text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-lycoris-600 hover:bg-lycoris-500 text-white font-semibold text-sm shadow-lycoris-glow transition-all"
            >
              Entrar no Painel
            </button>
          </form>

          <div className="text-center">
            <Link href="/" className="text-xs text-zinc-500 hover:text-lycoris-400 transition-colors">
              &larr; Voltar para a página pública
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gothic-bg text-zinc-100 p-4 sm:p-8">
      {/* Toast de Notificação */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-lycoris-900 border border-lycoris-600 text-white text-xs font-semibold shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Topo do Painel */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-serif text-2xl font-bold text-white">
              LYCORIS <span className="text-lycoris-500">ADMIN</span>
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-lycoris-950 border border-lycoris-800 text-lycoris-300 uppercase">
              Gerenciamento Ativo
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Controle de eventos, fotos da galeria e moderação de comentários da comunidade.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-xs text-zinc-300 hover:text-white px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 flex items-center gap-1.5 transition-colors"
          >
            <span>Ver Site Público</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={fetchDashboardData}
            title="Atualizar dados"
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={handleLogout}
            className="text-xs text-red-400 hover:text-red-300 px-3 py-2 rounded-lg bg-red-950/40 border border-red-900/60 flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sair</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Abas de Navegação */}
        <div className="flex border-b border-zinc-800 gap-2">
          <button
            onClick={() => setActiveTab('events')}
            className={`pb-3 px-4 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'events'
                ? 'border-lycoris-500 text-lycoris-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Eventos Futuros ({events.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('gallery')}
            className={`pb-3 px-4 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'gallery'
                ? 'border-lycoris-500 text-lycoris-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Galeria & Webhooks ({gallery.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('comments')}
            className={`pb-3 px-4 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'comments'
                ? 'border-lycoris-500 text-lycoris-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Moderação de Mensagens ({allComments.length})</span>
          </button>
        </div>

        {/* ============================================================== */}
        {/* ABA 1: EVENTOS */}
        {/* ============================================================== */}
        {activeTab === 'events' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Formulário Novo Evento */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-4">
              <h2 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-lycoris-500" />
                Novo Evento
              </h2>

              <form onSubmit={handleCreateEvent} className="space-y-3">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Título do Evento</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Noite de Chá Sob as Pétalas"
                    value={eventForm.title}
                    onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-xs focus:outline-none focus:border-lycoris-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Data</label>
                    <input
                      type="date"
                      required
                      value={eventForm.date}
                      onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-xs focus:outline-none focus:border-lycoris-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Horário</label>
                    <input
                      type="text"
                      required
                      value={eventForm.time}
                      onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-xs focus:outline-none focus:border-lycoris-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Mundo no VRChat</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Crimson Moon Shrine"
                    value={eventForm.vrchat_world}
                    onChange={(e) => setEventForm({ ...eventForm, vrchat_world: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-xs focus:outline-none focus:border-lycoris-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Link do Mundo (URL)</label>
                  <input
                    type="url"
                    placeholder="https://vrchat.com/home/world/wrld_..."
                    value={eventForm.world_url}
                    onChange={(e) => setEventForm({ ...eventForm, world_url: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-xs focus:outline-none focus:border-lycoris-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Categoria / Tag</label>
                  <select
                    value={eventForm.category}
                    onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-xs focus:outline-none focus:border-lycoris-500"
                  >
                    <option value="Encontro Oficial">Encontro Oficial</option>
                    <option value="Fotografia">Fotografia</option>
                    <option value="Música Noturna">Música Noturna</option>
                    <option value="Roleplay / Imersão">Roleplay / Imersão</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Descrição</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Descreva a dinâmica do encontro, dress code de avatar etc..."
                    value={eventForm.description}
                    onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-xs focus:outline-none focus:border-lycoris-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-lycoris-600 hover:bg-lycoris-500 text-white text-xs font-semibold shadow-lycoris-glow transition-all"
                >
                  Salvar e Publicar Evento
                </button>
              </form>
            </div>

            {/* Lista de Eventos Cadastrados */}
            <div className="lg:col-span-7 space-y-4">
              <h2 className="font-serif text-lg font-bold text-white">Eventos Ativos ({events.length})</h2>

              <div className="space-y-3">
                {events.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 flex items-start justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white text-sm">{ev.title}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-lycoris-950 border border-lycoris-800 text-lycoris-300">
                          {ev.category}
                        </span>
                      </div>
                      <div className="text-xs text-zinc-400 flex items-center gap-3">
                        <span>{ev.date} às {ev.time}</span>
                        <span>•</span>
                        <span className="text-zinc-300">{ev.vrchat_world}</span>
                      </div>
                      <p className="text-xs text-zinc-500 line-clamp-2">{ev.description}</p>
                    </div>

                    <button
                      onClick={() => handleDeleteEvent(ev.id)}
                      title="Excluir evento"
                      className="p-2 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-950/40 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* ABA 2: GALERIA & FEED WEBHOOK */}
        {/* ============================================================== */}
        {activeTab === 'gallery' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Adicionar Foto Manual */}
              <div className="lg:col-span-6 p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-4">
                <h2 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                  <Plus className="w-4 h-4 text-lycoris-500" />
                  Adicionar Foto Manualmente
                </h2>

                <form onSubmit={handleAddGalleryImage} className="space-y-3">
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Título do Registro</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Alvorada no Jardim Carmesim"
                      value={galleryForm.title}
                      onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-xs focus:outline-none focus:border-lycoris-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">URL Direta da Imagem</label>
                    <input
                      type="url"
                      required
                      placeholder="https://... ou caminho local /images/..."
                      value={galleryForm.url}
                      onChange={(e) => setGalleryForm({ ...galleryForm, url: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-xs focus:outline-none focus:border-lycoris-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-zinc-400 mb-1">Autor / Fotógrafo</label>
                      <input
                        type="text"
                        required
                        placeholder="Nick no VRChat"
                        value={galleryForm.author}
                        onChange={(e) => setGalleryForm({ ...galleryForm, author: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-xs focus:outline-none focus:border-lycoris-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-400 mb-1">Mundo VRChat</label>
                      <input
                        type="text"
                        placeholder="Nome da Instância"
                        value={galleryForm.vrchat_world}
                        onChange={(e) => setGalleryForm({ ...galleryForm, vrchat_world: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-xs focus:outline-none focus:border-lycoris-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-lycoris-600 hover:bg-lycoris-500 text-white text-xs font-semibold shadow-lycoris-glow transition-all"
                  >
                    Publicar Imagem na Galeria
                  </button>
                </form>
              </div>

              {/* Suporte a Webhook e Feed Automático */}
              <div className="lg:col-span-6 p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-4">
                <div className="flex items-center gap-2">
                  <Radio className="w-5 h-5 text-lycoris-400 animate-pulse" />
                  <h2 className="font-serif text-lg font-bold text-white">
                    Integração de Feed / Webhook
                  </h2>
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed">
                  Conecte seu Google Drive, Cloudinary ou Supabase Storage para alimentar a galeria automaticamente sempre que novas fotos dos encontros forem adicionadas.
                </p>

                <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs font-mono text-zinc-300 space-y-1">
                  <div className="text-[11px] text-zinc-500">ENDPOINT DO WEBHOOK:</div>
                  <div className="text-lycoris-400">POST /api/gallery</div>
                  <div className="text-[11px] text-zinc-500 mt-2">PAYLOAD ESPERADO:</div>
                  <div className="text-[11px] text-zinc-400">
                    &#123; &quot;title&quot;: &quot;...&quot;, &quot;url&quot;: &quot;https://...&quot;, &quot;author&quot;: &quot;...&quot; &#125;
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs text-zinc-400">Testar Disparo de Foto via Webhook</label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="Cole a URL da foto de teste..."
                      value={webhookUrlInput}
                      onChange={(e) => setWebhookUrlInput(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-xs focus:outline-none focus:border-lycoris-500"
                    />
                    <button
                      onClick={handleTriggerWebhookTest}
                      className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold"
                    >
                      Disparar
                    </button>
                  </div>
                  {webhookStatus && (
                    <p className="text-xs text-lycoris-300 font-medium">{webhookStatus}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Grid de Imagens com Exclusão */}
            <div className="space-y-4">
              <h3 className="font-serif text-lg font-bold text-white">Fotos Publicadas ({gallery.length})</h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {gallery.map((img) => (
                  <div
                    key={img.id}
                    className="relative group rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800"
                  >
                    <img src={img.url} alt={img.title} className="w-full h-32 object-cover" />
                    <div className="p-2 space-y-0.5">
                      <div className="font-semibold text-xs text-white truncate">{img.title}</div>
                      <div className="text-[10px] text-zinc-400 truncate">{img.author}</div>
                    </div>
                    <button
                      onClick={() => handleDeleteGallery(img.id)}
                      title="Excluir foto"
                      className="absolute top-2 right-2 p-1.5 rounded-md bg-black/80 hover:bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* ABA 3: MODERAÇÃO DE COMENTÁRIOS */}
        {/* ============================================================== */}
        {activeTab === 'comments' && (
          <div className="space-y-4">
            <div>
              <h2 className="font-serif text-lg font-bold text-white">
                Fila de Moderação de Mensagens ({allComments.length})
              </h2>
              <p className="text-xs text-zinc-400">
                Remova instantaneamente comentários inadequados deixados por visitantes nas fotos da galeria.
              </p>
            </div>

            {allComments.length === 0 ? (
              <div className="p-8 text-center text-zinc-500 text-xs">
                Nenhum comentário registrado na plataforma no momento.
              </div>
            ) : (
              <div className="space-y-3">
                {allComments.map((comm) => (
                  <div
                    key={comm.id}
                    className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-lycoris-400 text-xs">
                          {comm.author_name}
                        </span>
                        <span className="text-[10px] text-zinc-500">
                          {new Date(comm.created_at).toLocaleString('pt-BR')}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-200">{comm.content}</p>
                    </div>

                    <button
                      onClick={() => handleDeleteComment(comm.id)}
                      className="px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 border border-red-800 text-red-200 text-xs font-medium flex items-center gap-1.5 transition-colors shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Excluir</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
