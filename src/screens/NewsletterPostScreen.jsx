import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./NewsletterPostScreen.css";
import PostContent from "../components/NewsletterPostContent";
import { formatDate, parseRSS } from "../utils/newsletterUtils";

export default function NewsletterPostScreen() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Tenta carregar do sessionStorage
    const stored = sessionStorage.getItem("newsletter_post");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Os dados no sessionStorage já foram processados pelo parseRSS
        // na tela anterior, então já estão limpos.
        setPost(parsed);
        setLoading(false);
        return;
      } catch {}
    }

    // Fallback: busca o feed e acha pelo slug
    async function fetchAndSetPost() {
      try {
        const res = await fetch("/api/rss");
        const xmlText = await res.text();
        const parsedPosts = parseRSS(xmlText); // Usa a função parseRSS do utilitário
        const foundPost = parsedPosts.find(
          (p) => p.link.includes(slug) || p.guid.includes(slug),
        );
        if (foundPost) {
          setPost(foundPost); // O post já vem decodificado e formatado
        }
      } catch (err) {
        console.error("Erro ao buscar post da newsletter:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAndSetPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="post-screen post-loading">
        <div className="loading-dots">
          <span />
          <span />
          <span />
        </div>
        <p>Carregando publicação…</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="post-screen post-not-found">
        <h2>Publicação não encontrada</h2>
        <button
          className="post-back-btn"
          onClick={() =>
            navigate("/activity", { state: { scrollToPost: slug } })
          }
        >
          ← Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="post-screen">
      {/* Hero com imagem de capa */}
      {post.coverImage && (
        <div className="post-hero">
          <img src={post.coverImage} alt={post.title} />
          <div className="post-hero-gradient" />
        </div>
      )}

      <div className="post-container">
        {/* Botão voltar */}
        <button
          className="post-back-btn"
          onClick={() =>
            navigate("/activity", { state: { scrollToPost: slug } })
          }
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M13 8H3M7 4L3 8l4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Newsletter
        </button>

        {/* Cabeçalho do post */}
        <header className="post-header">
          <div className="post-meta">
            <span className="post-tag">Foto Essência</span>
            {post.pubDate && (
              <time className="post-date">{formatDate(post.pubDate)}</time>
            )}
          </div>
          <h1 className="post-title">{post.title}</h1>
          {post.description && (
            <p className="post-description">{post.description}</p>
          )}
          {post.creator && (
            <div className="post-author">
              <div className="post-author-avatar">FE</div>
              <span>{post.creator}</span>
            </div>
          )}
        </header>

        <div className="post-divider-line" />

        {/* Corpo do post */}
        <PostContent html={post.content} />

        {/* Rodapé */}
        <footer className="post-footer">
          <div className="post-footer-inner">
            <p>Gostou desta publicação?</p>
            <a
              href="https://fotoessencia.substack.com"
              target="_blank"
              rel="noopener noreferrer"
              className="post-subscribe-btn"
            >
              Assinar a newsletter
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
