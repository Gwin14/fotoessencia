import React from "react";
import "./Header.css";

export default function Header({ profilePic }) {
  return (
    <header className="header">
      <nav className="header-nav">
        <img src={profilePic} alt="Foto de perfil" className="headerPic" />

        <a href="#about">Sobre</a>
        <a href="#gallery">Galeria</a>
        <a href="#activities">Atividades</a>
        <a href="#Komorebi">Komorebi</a>
      </nav>
    </header>
  );
}
