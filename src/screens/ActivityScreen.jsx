import "./ActivityScreen.css";

import { useYoutube } from "../context/YoutubeContext";
import { useInstagram } from "../context/InstagramContext";
import React from "react";
import Carousel from "../components/Carousel";
import BlurText from "../components/BlurText";
import SpotlightCard from "../components/SpotlightCard";
import { useEffect, useState } from "react";
import { fetchInstagramProfileInfo } from "../services/instagram";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import { ScatterChart } from "@mui/x-charts/ScatterChart";
import { BarChart as HorizontalBarChart } from "@mui/x-charts/BarChart";

export default function ActivityScreen() {
  const { videos, loading } = useYoutube();
  const { images, loading: instagramLoading } = useInstagram();

  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchInstagramProfileInfo().then(setProfile);
  }, []);

  const instagramPosts = profile?.mediaCount || 0;
  const instagramFollowers = profile?.followers || 0;
  const instagramImages = images?.length || 0;
  const youtubeVideos = videos?.length || 0;

  const avgInstagramReach =
    instagramPosts > 0 ? Math.round(instagramFollowers / instagramPosts) : 0;

  const avgYoutubeReach =
    youtubeVideos > 0 ? Math.round(instagramFollowers / youtubeVideos) : 0;

  if (loading || instagramLoading) {
    return <p>Carregando atividades...</p>;
  }

  return (
    <div className="activity-screen">
      <section className="activity-title">
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
            baseWidth={600}
            autoplay={true}
            autoplayDelay={5000}
            pauseOnHover={true}
            loop={true}
            round={false}
            isYoutube={true}
          />
        </div>
      </section>

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
          {images && images.length > 0 ? (
            <SpotlightCard
              className="custom-spotlight-card"
              spotlightColor="rgba(255, 255, 255, 0.52)"
            >
              <img
                src={images[0]}
                alt="Post do Instagram"
                style={{ maxWidth: "35vw", borderRadius: 12 }}
              />
            </SpotlightCard>
          ) : (
            <p>Nenhum post do Instagram encontrado.</p>
          )}
        </div>

        <div className="blur-text-div">
          <BlurText text="Último" />
          <br />
          <BlurText text="Post" />
        </div>
      </section>
      <section
        className="activity-title instagram-section"
        style={{ marginTop: "200px" }}
      >
        {/* <div className="blur-text-div">
          <BlurText text="Crescimento" />
          <br />
          <BlurText text="Instagram" />
        </div> */}

        {profile ? (
          <div
            style={{
              maxWidth: 700,
              margin: "60px auto 0",
              padding: 32,
              borderRadius: 24,
              background: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(12px)",
            }}
          >
            <div style={{ width: "100%", height: 300 }}>
              <BarChart
                width={600}
                height={300}
                xAxis={[
                  {
                    scaleType: "band",
                    data: ["Seguidores", "Posts"],
                  },
                ]}
                series={[
                  {
                    data: [profile.followers, profile.mediaCount],
                  },
                ]}
                margin={{ top: 20, bottom: 40, left: 60, right: 20 }}
              />
            </div>

            {/* Gráficos avançados */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: 40,
                marginTop: 60,
              }}
            >
              {/* PieChart — distribuição de conteúdo */}
              <div>
                <h4 style={{ textAlign: "center", marginBottom: 12 }}>
                  Distribuição de Conteúdo
                </h4>
                <PieChart
                  height={260}
                  series={[
                    {
                      data: [
                        { id: 0, value: instagramImages, label: "Instagram" },
                        { id: 1, value: youtubeVideos, label: "YouTube" },
                      ],
                    },
                  ]}
                />
              </div>

              {/* ScatterChart — engajamento conceitual (não comum) */}
              <div>
                <h4 style={{ textAlign: "center", marginBottom: 12 }}>
                  Alcance vs Produção
                </h4>
                <ScatterChart
                  height={260}
                  xAxis={[{ label: "Quantidade de Conteúdo" }]}
                  yAxis={[{ label: "Audiência" }]}
                  series={[
                    {
                      data: [
                        {
                          x: instagramPosts,
                          y: instagramFollowers,
                          id: "instagram",
                        },
                        {
                          x: youtubeVideos,
                          y: youtubeVideos * 100,
                          id: "youtube",
                        },
                      ],
                    },
                  ]}
                />
              </div>
            </div>

            {/* Gráficos adicionais — Dados reais */}
            <div style={{ marginTop: 80 }}>
              <h3 style={{ textAlign: "center", marginBottom: 40 }}>
                Comparações Reais de Produção
              </h3>

              {/* Volume por plataforma */}
              <div style={{ marginBottom: 60 }}>
                <h4 style={{ textAlign: "center", marginBottom: 12 }}>
                  Volume de Conteúdo por Plataforma
                </h4>
                <BarChart
                  width={600}
                  height={300}
                  xAxis={[
                    {
                      scaleType: "band",
                      data: ["Instagram", "YouTube"],
                    },
                  ]}
                  series={[
                    {
                      data: [instagramPosts, youtubeVideos],
                    },
                  ]}
                />
              </div>

              {/* Alcance médio por conteúdo */}
              <div>
                <h4 style={{ textAlign: "center", marginBottom: 12 }}>
                  Alcance Médio por Conteúdo
                </h4>
                <HorizontalBarChart
                  width={600}
                  height={300}
                  layout="horizontal"
                  yAxis={[
                    {
                      scaleType: "band",
                      data: ["Instagram", "YouTube"],
                    },
                  ]}
                  series={[
                    {
                      data: [avgInstagramReach, avgYoutubeReach],
                    },
                  ]}
                />
              </div>
            </div>
          </div>
        ) : (
          <p>Carregando métricas do Instagram...</p>
        )}
      </section>
    </div>
  );
}
