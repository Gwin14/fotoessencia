import RotatingText from "../components/RotatingText";
import "./KomorebiScreen.css";
import BlurText from "../components/BlurText";
import { FaApple, FaGooglePlay } from "react-icons/fa";

import iconeKomorebi from "../assets/image/iconeKomorebi.png";
import videoKomorebi from "../assets/video/video.MP4";
import mockupTriple from "../assets/mockupTriple.png";

export default function KomorebiScreen() {
  return (
    <>
      <div className="komorebi-container">
        <img
          className="komorebi-icon"
          src={iconeKomorebi}
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
          <video loop autoPlay muted playsInline src={videoKomorebi}></video>
        </section>

        <section className="demonstrationSecond">
          <img src={mockupTriple} alt="mockup celulares" />
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

        <div className="download-section">
          <h2 className="download-title">Em breve nas lojas</h2>
          <div className="store-buttons">
            <button className="store-button">
              <FaApple size={24} />
              <span>App Store</span>
            </button>
            <button className="store-button">
              <FaGooglePlay size={24} />
              <span>Google Play</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
