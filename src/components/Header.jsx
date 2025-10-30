import React from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";
import { FaUser, FaImages, FaRunning, FaAppStore } from "react-icons/fa";

export default function Header({ profilePic }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/`);
  };

  return (
    <header className="header">
      <nav className="header-nav pc">
        <img src={profilePic} alt="Foto de perfil" className="headerPic" />

        <a href="/">Sobre</a>
        <a href="/WIP">Galeria</a>
        <a href="/WIP">Atividades</a>
        <a href="/WIP">Komorebi</a>
      </nav>

      <nav className="header-nav mobile">
        <img src={profilePic} alt="Foto de perfil" className="headerPic" />

        <a href="#about" title="Sobre">
          <FaUser size={24} color="#fff" />
        </a>
        <a href="#gallery" title="Galeria">
          <FaImages size={24} color="#fff" />
        </a>
        <a href="#activities" title="Atividades">
          <FaRunning size={24} color="#fff" />
        </a>
        <a href="#Komorebi" title="App">
          <FaAppStore size={24} color="#fff" />
        </a>
      </nav>
    </header>
  );
}
