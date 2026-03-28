import "./ActivityScreen.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useYoutube } from "../context/YoutubeContext";
import { useInstagram } from "../context/InstagramContext";
import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Carousel from "../components/Carousel";
import BlurText from "../components/BlurText";
import SpotlightCard from "../components/SpotlightCard";
import NewsletterCard from "../components/NewsletterCard";
import { parseRSS, formatDate } from "../utils/newsletterUtils";
import { p } from "framer-motion/client";

const pageVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -30 },
};
const pageTransition = { duration: 0.4, ease: "easeInOut" };

export default function ActivityScreen() {
  const { videos, loading } = useYoutube();
  const { images, loading: instagramLoading } = useInstagram();
  const [posts, setPosts] = useState([]);
  const [newsletterLoading, setNewsletterLoading] = useState(true);
  const [newsletterError, setNewsletterError] = useState(null);

  const [carouselWidth, setCarouselWidth] = useState(600);

  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth;

      if (width < 600) setCarouselWidth(width * 0.9);
      else if (width < 1000) setCarouselWidth(width * 0.8);
      else setCarouselWidth(600);
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    async function loadFeed() {
      try {
        const res = await fetch("/api/rss");
        const xmlText = await res.text();
        const parsed = parseRSS(xmlText);
        setPosts(parsed);
      } catch (err) {
        console.error(err);
        setNewsletterError("Não foi possível carregar os posts.");
      } finally {
        setNewsletterLoading(false);
      }
    }
    loadFeed();
  }, []);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const targetSlug = location.state?.scrollToPost;
    if (!targetSlug) return;

    const timeout = setTimeout(() => {
      const el = document.getElementById(`post-${targetSlug}`);
      el?.scrollIntoView({ behavior: "instant", block: "center" });
    }, 110);

    window.history.replaceState({}, "");
    return () => clearTimeout(timeout);
  }, [location.state]);

  const handlePostClick = (post) => {
    const slug =
      post.link.split("/p/")[1] ?? post.guid.split("/p/")[1] ?? "post";
    sessionStorage.setItem("newsletter_post", JSON.stringify(post));
    navigate(`/activity/${slug}`);
  };

  if (loading || instagramLoading) {
    return <p>Carregando atividades...</p>;
  }

  return (
    <div className="activity-screen">
      <AnimatePresence
        mode="wait"
        onExitComplete={() => window.scrollTo({ top: 0 })}
      >
        <motion.div
          key="gallery"
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={pageTransition}
        >
          <section className="activity-title youtube-section">
            <div className="blur-text-div">
              <BlurText text="Atividade" />
              <br />
              <BlurText text="recente" />
            </div>

            <div
              style={{
                minHeight: "300px",
                maxHeight: "600px",
                position: "relative",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Carousel
                items={videos || []}
                baseWidth={carouselWidth}
                autoplay={true}
                autoplayDelay={5000}
                pauseOnHover={true}
                loop={true}
                round={false}
                isYoutube={true}
              />
            </div>
          </section>

          {images && images.length > 0 && (
            <section
              className="activity-title instagram-section"
              style={{ marginTop: "200px" }}
            >
              <div
                style={{
                  minHeight: "300px",
                  maxHeight: "600px",
                  position: "relative",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <SpotlightCard
                  className="custom-spotlight-card"
                  spotlightColor="rgba(255, 255, 255, 0.52)"
                >
                  <img
                    src={images[0]}
                    alt="Post do Instagram"
                    style={{
                      maxWidth: "40vw",
                      borderRadius: 12,
                      height: "100%",
                    }}
                  />
                </SpotlightCard>
              </div>

              <div className="blur-text-div">
                <BlurText text="Último" />
                <br />
                <BlurText text="Post" />
              </div>
            </section>
          )}

          <section
            className=" newsletter-section"
            style={{ marginTop: "200px" }}
          >
            <div className="blur-text-div">
              <BlurText text="Newsletter" />
            </div>

            <div className="newsletter-main">
              {newsletterLoading && (
                <div className="newsletter-loading">
                  <div className="loading-dots">
                    <span />
                    <span />
                    <span />
                  </div>
                  <p>Carregando publicações…</p>
                </div>
              )}

              {newsletterError && (
                <p className="newsletter-error">{newsletterError}</p>
              )}

              {!newsletterLoading && !newsletterError && posts.length === 0 && (
                <p className="newsletter-empty">
                  Nenhuma publicação encontrada.
                </p>
              )}

              <div className="newsletter-grid">
                {posts.map((post, idx) => {
                  const slug =
                    post.link.split("/p/")[1] ??
                    post.guid.split("/p/")[1] ??
                    "post";
                  return (
                    <NewsletterCard
                      key={post.guid}
                      post={post}
                      idx={idx}
                      onClick={handlePostClick}
                      slug={slug}
                    />
                  );
                })}

                <iframe
                  src="https://fotoessencia.substack.com/embed"
                  width="100%"
                  height="100%"
                  style={{
                    border: " 1px solid #cdcdbe",
                    background: "white",
                    borderRadius: "16px",
                    // margin: " auto",
                  }}
                  frameBorder="0"
                  scrolling="no"
                />
              </div>
            </div>
          </section>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
