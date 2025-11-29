import React from "react";
import { Link } from "react-router-dom";
import "../style/Bienvenida.css";
// 1. Importación del logo:
import Logo from "../assets/Logo.png";

const Bienvenida = () => {
  return (
    <div className="bienvenida-container">
      {/* 2. Implementación del logo en una sección que puedes estilizar */}
      <header className="bienvenida-header">
        <Link to="/">
          <img 
            src={Logo} 
            alt="Logo de Jewelry" 
            className="bienvenida-logo" 
          />
        </Link>
      </header>
      
      <h1 className="bienvenida-titulo">
        Bienvenida a <span>Jewelry</span>
      </h1>
      <p className="bienvenida-texto">
        Es una plataforma inspirada en la belleza, fuerza y brillo de las mujeres,
        para reflejar tu esencia y acompañarte en cada momento especial.
      </p>
      <div className="bienvenida-botones">
        <Link to="/login" className="btn primario">
          Iniciar sesión
        </Link>
        <Link to="/registro" className="btn secundario">
          Crear cuenta
        </Link>
      </div>
    </div>
  );
};

export default Bienvenida;