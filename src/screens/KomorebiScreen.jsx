import RotatingText from "../components/RotatingText";
import "./KomorebiScreen.css";

export default function KomorebiScreen() {
  return (
    <>
      <div className="komorebi-container">
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
        <img
          className="mockup-triple"
          src="src/assets/mockupTriple.png"
          alt="mockup celulares"
        />
      </div>
    </>
  );
}
