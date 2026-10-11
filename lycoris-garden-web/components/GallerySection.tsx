"use client";

import React, { useState, useEffect } from 'react';
import { Camera, MessageSquare, Heart, X, Send, User } from 'lucide-react';
import { GalleryImage, CommentItem } from '@/lib/types';

export default function GallerySection() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<GalleryImage | null>(null);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [authorName, setAuthorName] = useState('');
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function loadGallery() {
      try {
        setLoading(true);
        const res = await fetch('/api/gallery', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setImages(data);
          }
        }
      } catch (err) {
        console.warn('Erro ao carregar galeria:', err);
      } finally {
        setLoading(false);
      }
    }
    loadGallery();
  }, []);

  const openLightbox = async (img: GalleryImage) => {
    setActiveImage(img);
    setComments(img.comments || []);

    try {
      const res = await fetch('/api/comments?imageId=' + img.id, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setComments(data);
      }
    } catch (err) {
      console.warn('Erro ao carregar comentários:', err);
    }
  };

  const closeLightbox = () => {
    setActiveImage(null);
    setNewComment('');
  };

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedMap((prev) => {
      const isLiked = !prev[id];
      setImages((current) =>
        current.map((item) =>
          item.id === id ? { ...item, likes: item.likes + (isLiked ? 1 : -1) } : item
        )
      );
      return { ...prev, [id]: isLiked };
    });
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeImage || !authorName.trim() || !newComment.trim()) return;

    setSubmittingComment(true);
    const optimisticComment: CommentItem = {
      id: 'comm-' + Date.now(),
      image_id: activeImage.id,
      author_name: authorName.trim(),
      content: newComment.trim(),
      created_at: new Date().toISOString(),
    };

    setComments((prev) => [optimisticComment, ...prev]);
    setNewComment('');

    try {
      await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image_id: activeImage.id,
          author_name: authorName.trim(),
          content: optimisticComment.content,
        }),
      });
    } catch (err) {
      console.error('Falha ao persistir comentário:', err);
    } finally {
      setSubmittingComment(false);
    }
  };

  return (
    <section id="galeria" className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
      <div className="text-center space-y-4 mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lycoris-950/70 border border-lycoris-800/40 text-lycoris-400 text-xs font-semibold uppercase tracking-widest">
          <Camera className="w-3.5 h-3.5 text-lycoris-500" />
          Registros e Memórias
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
          Galeria <span className="text-lycoris-500">Comunitária</span>
        </h2>
        <div className="flex items-center justify-center gap-3">
          <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-lycoris-600" />
          <div className="w-2 h-2 rotate-45 bg-lycoris-500 shadow-lycoris-glow" />
          <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-lycoris-600" />
        </div>
        <p className="font-sans text-zinc-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
          Momentos capturados por nossos fotógrafos e membros. Clique em qualquer imagem para abrir em alta resolução e deixar sua mensagem.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-16 text-xs text-zinc-500 animate-pulse">
          Carregando memórias do santuário...
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-16 px-6 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 max-w-lg mx-auto backdrop-blur-sm">
          <Camera className="w-10 h-10 text-lycoris-500/60 mx-auto mb-3" />
          <h3 className="font-serif text-lg font-bold text-white">Nenhuma foto publicada no momento</h3>
          <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
            As capturas adicionadas pelo painel administrativo aparecerão aqui.
          </p>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {images.map((img) => (
            <div
              key={img.id}
              onClick={() => openLightbox(img)}
              className="group relative cursor-pointer break-inside-avoid overflow-hidden rounded-2xl bg-zinc-950 border border-zinc-800/80 hover:border-lycoris-600/70 transition-all duration-300 hover:shadow-lycoris-glow hover:-translate-y-1"
            >
              <div className="relative w-full aspect-[4/3] sm:aspect-auto">
                <img
                  src={img.url}
                  alt="Registro fotográfico Lycoris Garden"
                  className="w-full h-auto object-cover transform transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Overlay limpo sem exibir o nome do arquivo */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-5 flex flex-col justify-end">
                <span className="text-xs text-lycoris-400 font-medium">
                  {img.vrchat_world || 'Lycoris Garden Sanctuary'}
                </span>
                <p className="text-xs text-zinc-300 mt-0.5">
                  Por <span className="font-semibold text-zinc-100">{img.author}</span>
                </p>

                <div className="flex items-center justify-between pt-3 mt-2 border-t border-zinc-700/50">
                  <button
                    onClick={(e) => handleLike(img.id, e)}
                    className="flex items-center gap-1.5 text-xs text-zinc-300 hover:text-lycoris-400 transition-colors"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        likedMap[img.id] ? 'fill-lycoris-500 text-lycoris-500' : 'text-zinc-400'
                      }`}
                    />
                    <span>{img.likes}</span>
                  </button>

                  <div className="flex items-center gap-1.5 text-xs text-zinc-300">
                    <MessageSquare className="w-4 h-4 text-zinc-400" />
                    <span>{(img.comments && img.comments.length) || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-6"
          onClick={closeLightbox}
        >
          <div
            className="relative max-w-6xl w-full max-h-[90vh] bg-gothic-card rounded-2xl border border-lycoris-900/40 shadow-2xl overflow-hidden flex flex-col lg:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 hover:bg-black/90 text-zinc-300 hover:text-white transition-colors border border-zinc-700"
              aria-label="Fechar modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="lg:w-7/12 bg-black flex items-center justify-center p-4 relative min-h-[300px] lg:min-h-[600px]">
              <img
                src={activeImage.url}
                alt="Registro em tela cheia"
                className="max-h-[80vh] w-auto max-w-full object-contain rounded-lg shadow-lg"
              />
            </div>

            <div className="lg:w-5/12 p-6 flex flex-col justify-between bg-zinc-950 border-t lg:border-t-0 lg:border-l border-zinc-800/80 overflow-y-auto max-h-[85vh]">
              <div>
                <div className="space-y-2 pb-4 border-b border-zinc-800">
                  <span className="text-xs uppercase tracking-wider text-lycoris-400 font-semibold">
                    {activeImage.vrchat_world || 'Lycoris Garden Sanctuary'}
                  </span>
                  <div className="flex items-center justify-between text-xs text-zinc-400 pt-1">
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-lycoris-500" />
                      Capturada por <strong className="text-zinc-200">{activeImage.author}</strong>
                    </span>
                    <button
                      onClick={(e) => handleLike(activeImage.id, e)}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 hover:border-lycoris-600/50 text-xs text-zinc-300 transition-colors"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          likedMap[activeImage.id] ? 'fill-lycoris-500 text-lycoris-500' : 'text-zinc-400'
                        }`}
                      />
                      <span>{activeImage.likes} curtidas</span>
                    </button>
                  </div>
                </div>

                <div className="pt-4 space-y-4">
                  <h4 className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-lycoris-500" />
                    Comentários ({comments.length})
                  </h4>

                  <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                    {comments.length === 0 ? (
                      <p className="text-xs text-zinc-500 italic py-4 text-center">
                        Nenhum comentário ainda. Deixe sua mensagem nesta memória!
                      </p>
                    ) : (
                      comments.map((comm) => (
                        <div
                          key={comm.id}
                          className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 text-xs space-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-lycoris-300">{comm.author_name}</span>
                            <span className="text-[10px] text-zinc-500">
                              {new Date(comm.created_at).toLocaleTimeString('pt-BR', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                          <p className="text-zinc-300 leading-relaxed font-sans">{comm.content}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <form onSubmit={handleAddComment} className="pt-4 mt-4 border-t border-zinc-800/80 space-y-3">
                <div className="space-y-2">
                  <input
                    type="text"
                    required
                    placeholder="Seu nome ou Nick no VRChat..."
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-zinc-900 border border-zinc-800 focus:border-lycoris-500 text-white placeholder-zinc-500 focus:outline-none"
                  />
                  <div className="relative">
                    <textarea
                      required
                      rows={2}
                      placeholder="Deixe uma mensagem sobre esta memória..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg bg-zinc-900 border border-zinc-800 focus:border-lycoris-500 text-white placeholder-zinc-500 focus:outline-none resize-none pr-10"
                    />
                    <button
                      type="submit"
                      disabled={submittingComment || !authorName.trim() || !newComment.trim()}
                      className="absolute right-2 bottom-3 p-1.5 rounded-md bg-lycoris-600 hover:bg-lycoris-500 disabled:opacity-40 text-white transition-colors"
                      title="Enviar comentário"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
