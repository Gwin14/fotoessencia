import RotatingText from "../components/RotatingText";
import "./KomorebiScreen.css";
import BlurText from "../components/BlurText";

export default function KomorebiScreen() {
  return (
    <>
      <div className="komorebi-container">
        <img
          className="komorebi-icon"
          src="src/assets/image/iconeKomorebi.png"
          alt="icone komorebi"
        />

        <section className="komorebi-hero">
          <h1 className="komorebi-title">
            Komorebi, seu app de{" "}
            <span className="komorebi-rotating">
              <RotatingText
                texts={["câmera", "filtros", "tempo", "galeria"]}
                rotationInterval={2500}
              />
            </span>
          </h1>
        </section>

        <section className="demonstration">
          <div>
            <BlurText
              text="Tire fotos incríveis"
              delay={200}
              animateBy="words"
              direction="top"
              className="text-2xl mb-8"
            />
            <BlurText
              text="E dê seu toque pessoal"
              delay={200}
              animateBy="words"
              direction="bottom"
              className="text-2xl mb-8"
            />
          </div>
          <video
            loop
            autoPlay
            muted
            playsInline
            src="src/assets/video/video.MP4"
          ></video>
        </section>

        <section className="demonstration">
          <img src="src/assets/mockupTriple.png" alt="mockup celulares" />
          <div>
            <BlurText
              text="Múltiplas funcionalidades"
              delay={200}
              animateBy="words"
              direction="top"
              className="text-2xl mb-8"
            />
            <BlurText
              text="Para capturar o melhor do momento"
              delay={200}
              animateBy="words"
              direction="bottom"
              className="text-2xl mb-8"
            />
          </div>
        </section>
      </div>
    </>
  );
}
