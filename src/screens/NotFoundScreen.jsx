import { Link } from "react-router-dom";
import "./NotFoundScreen.css";
import dogImage from "../assets/image/404.webp";

export default function NotFoundScreen() {
  return (
    <div className="not-found">
      <h1 className="not-found-code">404</h1>
      <p className="not-found-text">Essa página não existe.</p>
      <img src={dogImage} alt="Cachorro confuso" className="not-found-image" />
      <Link to="/" className="not-found-link">
        Voltar para o início
      </Link>
    </div>
  );
}
