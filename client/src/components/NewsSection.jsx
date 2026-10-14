// client/src/components/NewsSection.jsx
import React, { useState, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';
import {
  Newspaper,
  Calendar,
  MapPin,
  User,
  ArrowRight,
  Sparkles,
  Tag,
  X,
  Share2
} from 'lucide-react';
import { fetchNews } from '../api';

export default function NewsSection({ onOpenAdmin, selectedCountry }) {
  const [articles, setArticles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [activeArticle, setActiveArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      setLoading(true);
      const data = await fetchNews();
      if (data && data.data) {
        setArticles(data.data);
      }
    } catch (err) {
      console.error('Error fetching news:', err);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['ALL', 'STEM & Robotics', 'Campus Facilities', 'Culture & Arts', 'Academic Excellence'];

  const filteredArticles = articles.filter((art) => {
    const matchesCategory = selectedCategory === 'ALL' || art.category === selectedCategory;
    const matchesCountry =
      !selectedCountry ||
      selectedCountry === 'ALL' ||
      art.campus?.toLowerCase().includes(selectedCountry.toLowerCase());
    return matchesCategory;
  });

  return (
    <section className="news-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-head-row">
          <div>
            <div className="badge badge-cyan" style={{ marginBottom: 12 }}>
              <Sparkles size={14} />
              <span>Official GCC Campus Dispatches</span>
            </div>
            <h2 className="news-main-title">
              Campus News & <span className="text-cyan">Headlines</span>
            </h2>
            <p className="news-sub-title">
              Real-time updates posted directly by the Central Academic Directorate across Dubai, Riyadh, Manama, and Kuwait City.
            </p>
          </div>

          <button className="btn-secondary" onClick={onOpenAdmin}>
            <Newspaper size={16} />
            Post News (Admin)
          </button>
        </div>

        {/* Category Filters */}
        <div className="category-filters">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat === 'ALL' ? 'All Headlines' : cat}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        {loading ? (
          <div className="loading-box">Loading latest GCC school news...</div>
        ) : filteredArticles.length === 0 ? (
          <div className="empty-news glass-panel">
            <Newspaper size={40} className="text-muted" />
            <p>No articles found for the selected category. Check back soon!</p>
          </div>
        ) : (
          <div className="news-cards-grid">
            {filteredArticles.map((article, idx) => (
              <article
                key={article.id}
                className="news-card glass-panel"
                onClick={() => setActiveArticle(article)}
              >
                <div className="news-image-wrapper">
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    className="news-image"
                    loading="lazy"
                  />
                  <span className="news-category-badge">{article.category}</span>
                </div>

                <div className="news-body">
                  <div className="news-meta-row">
                    <span className="news-meta-item">
                      <Calendar size={13} />
                      {article.date}
                    </span>
                    <span className="news-meta-item">
                      <MapPin size={13} />
                      {article.campus?.split('(')[0] || 'GCC Campus'}
                    </span>
                  </div>

                  <h3 className="article-title">{article.title}</h3>
                  <p className="article-snippet">{article.summary}</p>

                  <div className="news-card-footer">
                    <span className="read-more-link">
                      <span>Read Story</span>
                      <ArrowRight size={14} />
                    </span>
                    <span className="author-tag">{article.author}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Modal: Full Article Reader */}
        {activeArticle && (
          <div className="modal-overlay" onClick={() => setActiveArticle(null)}>
            <div className="modal-content news-modal glass-panel" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close-btn" onClick={() => setActiveArticle(null)}>
                <X size={20} />
              </button>

              <img
                src={activeArticle.coverImage}
                alt={activeArticle.title}
                className="modal-cover-image"
              />

              <div className="modal-inner-padding">
                <div className="modal-meta-bar">
                  <span className="badge badge-emerald">{activeArticle.category}</span>
                  <span className="meta-text">
                    <Calendar size={14} /> {activeArticle.date}
                  </span>
                  <span className="meta-text">
                    <MapPin size={14} /> {activeArticle.campus}
                  </span>
                </div>

                <h2 className="modal-headline">{activeArticle.title}</h2>
                <div className="author-byline">
                  By <strong>{activeArticle.author}</strong> • Central GCC Directorate
                </div>

                <div className="modal-article-text">
                  <p>{activeArticle.content}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .news-section {
          padding: 50px 0;
        }

        .section-head-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 20px;
          margin-bottom: 30px;
        }

        .news-main-title {
          font-size: clamp(2rem, 3.5vw, 2.8rem);
          margin-bottom: 8px;
        }

        .text-cyan {
          color: #22d3ee;
        }

        .news-sub-title {
          color: #94a3b8;
          max-width: 650px;
          font-size: 1rem;
        }

        .category-filters {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 32px;
        }

        .filter-btn {
          padding: 8px 18px;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #94a3b8;
          font-size: 0.85rem;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .filter-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          color: #ffffff;
        }

        .filter-btn.active {
          background: #06b6d4;
          color: #082f49;
          border-color: #22d3ee;
          font-weight: 700;
        }

        .news-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 24px;
        }

        .news-card {
          border-radius: 20px;
          overflow: hidden;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          transition: transform 0.25s ease, border-color 0.25s ease;
        }

        .news-card:hover {
          transform: translateY(-5px);
          border-color: rgba(6, 182, 212, 0.4);
        }

        .news-image-wrapper {
          position: relative;
          height: 200px;
          overflow: hidden;
        }

        .news-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .news-card:hover .news-image {
          transform: scale(1.05);
        }

        .news-category-badge {
          position: absolute;
          top: 14px;
          left: 14px;
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(8px);
          color: #38bdf8;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 9999px;
          border: 1px solid rgba(255, 255, 255, 0.12);
        }

        .news-body {
          padding: 20px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .news-meta-row {
          display: flex;
          align-items: center;
          gap: 14px;
          font-size: 0.78rem;
          color: #64748b;
          margin-bottom: 10px;
        }

        .news-meta-item {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .article-title {
          font-size: 1.18rem;
          line-height: 1.35;
          margin-bottom: 10px;
          color: #ffffff;
        }

        .article-snippet {
          font-size: 0.88rem;
          color: #94a3b8;
          line-height: 1.6;
          margin-bottom: 20px;
          flex: 1;
        }

        .news-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 14px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
        }

        .read-more-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.85rem;
          font-weight: 600;
          color: #22d3ee;
        }

        .author-tag {
          font-size: 0.72rem;
          color: #64748b;
        }

        .news-modal {
          max-width: 720px;
          padding: 0;
          overflow: hidden;
        }

        .modal-close-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.6);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
        }

        .modal-cover-image {
          width: 100%;
          height: 280px;
          object-fit: cover;
        }

        .modal-inner-padding {
          padding: 28px;
        }

        .modal-meta-bar {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 16px;
        }

        .meta-text {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.82rem;
          color: #94a3b8;
        }

        .modal-headline {
          font-size: 1.8rem;
          margin-bottom: 8px;
          line-height: 1.25;
        }

        .author-byline {
          font-size: 0.86rem;
          color: #64748b;
          margin-bottom: 20px;
        }

        .modal-article-text p {
          font-size: 1.05rem;
          line-height: 1.8;
          color: #cbd5e1;
        }

        .loading-box, .empty-news {
          text-align: center;
          padding: 60px 20px;
          color: #94a3b8;
        }
      `}</style>
    </section>
  );
}
