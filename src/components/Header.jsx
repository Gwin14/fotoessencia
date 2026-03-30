import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import { FaUser, FaImages, FaAppStore, FaNewspaper } from "react-icons/fa";
import { useInstagram } from "../context/InstagramContext";

export default function Header() {
  const { profileInfo } = useInstagram();

  const defaultPic = "https://via.placeholder.com/40x40/444/FFFFFF?text=•";

  return (
    <header className="header">
      {/* Navegação desktop */}
      <nav className="header-nav pc">
        <img
          src={profileInfo?.profilePicture || defaultPic}
          alt="Foto de perfil"
          className="headerPic"
        />
        <Link to="/">Sobre</Link>
        <Link to="/galery">Galeria</Link>
        <Link to="/activity">Atividades</Link>
        <Link to="/Komorebi">Komorebi</Link>
      </nav>

      {/* Navegação mobile */}
      <nav className="header-nav mobile">
        <img
          src={profileInfo?.profilePicture || defaultPic}
          alt="Foto de perfil"
          className="headerPic"
        />
        <Link to="/" title="Sobre">
          <FaUser size={24} color="#fff" />
        </Link>
        <Link to="/galery" title="Galeria">
          <FaImages size={24} color="#fff" />
        </Link>
        <Link to="/activity" title="Atividades">
          <FaNewspaper size={24} color="#fff" />
        </Link>
        <Link to="/Komorebi" title="App Komorebi">
          <FaAppStore size={24} color="#fff" />
        </Link>
      </nav>
    </header>
  );
}
