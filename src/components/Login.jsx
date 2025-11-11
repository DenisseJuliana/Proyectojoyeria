import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import "../style/Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    contraseña: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nombreValido = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(formData.nombre);
    const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo);
    const contraseñaValida = /^[0-9]{7}$/.test(formData.contraseña); // 7 dígitos

    if (!nombreValido) return alert("El nombre solo debe contener letras.");
    if (!correoValido) return alert("Correo inválido.");
    if (!contraseñaValida) return alert("La contraseña debe tener exactamente 7 números.");

    try {
      await signInWithEmailAndPassword(auth, formData.correo, formData.contraseña);
      alert("Inicio de sesión exitoso ✅");
      navigate("/compra"); // ✅ AHORA redirige a la vista principal (Compra)
    } catch (error) {
      alert("Error al iniciar sesión: " + error.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Iniciar Sesión</h2>

        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="nombre">Nombre</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            placeholder="Tu nombre"
            value={formData.nombre}
            onChange={handleChange}
            pattern="[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+"
            required
          />
          <label htmlFor="correo">Correo</label>
          <input
            type="email"
            id="correo"
            name="correo"
            placeholder="tu@email.com"
            value={formData.correo}
            onChange={handleChange}
            required
          />
          <label htmlFor="contraseña">Contraseña</label>
          <input
            type="password"
            id="contraseña"
            name="contraseña"
            placeholder="7 dígitos"
            value={formData.contraseña}
            onChange={handleChange}
            pattern="[0-9]{7}"
            maxLength="7"
            required
          />

          <div className="login-boton-container">
            <button type="submit" className="btn-aceptar">Aceptar</button>
          </div>
        </form>

        <div className="login-footer">
          <p>¿No tienes cuenta?</p>
          <Link to="/registro" className="registrarse-link">Registrarse</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
