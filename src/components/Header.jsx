import React from "react";
import "./Header.css";
import { FaUser, FaImages, FaRunning, FaAppStore } from "react-icons/fa";

export default function Header({ profilePic }) {
  return (
    <header className="header">
      <nav className="header-nav pc">
        <img src={profilePic} alt="Foto de perfil" className="headerPic" />

        <a href="#about">Sobre</a>
        <a href="#gallery">Galeria</a>
        <a href="#activities">Atividades</a>
        <a href="#Komorebi">Komorebi</a>
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
