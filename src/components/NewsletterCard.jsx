import React from "react";
import { decodeHtmlEntities, formatDate } from "../utils/newsletterUtils";
import "./NewsletterCard.css"; // Importe os estilos específicos do card

export default function NewsletterCard({ post, idx, onClick, slug }) {
  return (
    <article
      className="newsletter-card"
      onClick={() => onClick(post)}
      style={{ animationDelay: `${idx * 0.1}s` }}
      id={`post-${slug}`}
    >
      <div className="newsletter-card-image">
        {post.coverImage ? (
          <img src={post.coverImage} alt={post.title} loading="lazy" />
        ) : (
          <div className="newsletter-card-placeholder">
            <span>📷</span>
          </div>
        )}
        <div className="newsletter-card-overlay" />
      </div>

      <div className="newsletter-card-body">
        <div className="newsletter-card-meta">
          <time>{formatDate(post.pubDate)}</time>
          {post.creator && (
            <span className="newsletter-card-author">{post.creator}</span>
          )}
        </div>
        <h2 className="newsletter-card-title">
          {decodeHtmlEntities(post.title)}
        </h2>
        <p className="newsletter-card-excerpt">
          {post.description
            ? decodeHtmlEntities(post.description)
            : post.excerpt}
        </p>
        <div className="newsletter-card-cta">
          <span>Ler publicação</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M3 8h10M9 4l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </article>
  );
}
