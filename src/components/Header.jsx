import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import { FaUser, FaImages, FaRunning, FaAppStore } from "react-icons/fa";

export default function Header({ profilePic }) {
  return (
    <header className="header">
      {/* Navegação em desktop */}
      <nav className="header-nav pc">
        <img src={profilePic} alt="Foto de perfil" className="headerPic" />

        <Link to="/">Sobre</Link>
        <Link to="/galery">Galeria</Link>
        <Link to="/WIP">Atividades</Link>
        <Link to="/WIP">Komorebi</Link>
      </nav>

      {/* Navegação em mobile (ícones) */}
      <nav className="header-nav mobile">
        <img src={profilePic} alt="Foto de perfil" className="headerPic" />

        <Link to="/" title="Sobre">
          <FaUser size={24} color="#fff" />
        </Link>
        <Link to="/galery" title="Galeria">
          <FaImages size={24} color="#fff" />
        </Link>
        <Link to="/WIP" title="Atividades">
          <FaRunning size={24} color="#fff" />
        </Link>
        <Link to="/WIP" title="App Komorebi">
          <FaAppStore size={24} color="#fff" />
        </Link>
      </nav>
    </header>
  );
}
