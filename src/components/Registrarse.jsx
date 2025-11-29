// src/components/Registrarse.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db, serverTimestamp } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import "../style/Registrarse.css";

// 🖼️ Importación del Logo
import Logo from "../assets/Logo.png";

// Prop: `mostrarNotificacion` para usar en lugar de alert()
const Registrarse = ({ mostrarNotificacion }) => {
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

    // Validaciones Locales
    const nombreValido = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(formData.nombre);
    const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo);
    const contraseñaValida = /^[0-9]{7}$/.test(formData.contraseña); // 7 dígitos

    if (!nombreValido)
      return mostrarNotificacion(
        "El nombre solo debe contener letras.",
        "error"
      );
    if (!correoValido)
      return mostrarNotificacion(
        "Por favor ingresa un correo válido con '@'.",
        "error"
      );
    if (!contraseñaValida)
      return mostrarNotificacion(
        "La contraseña debe tener exactamente 7 números.",
        "error"
      );

    try {
      // 1. Crear la cuenta en Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.correo,
        formData.contraseña
      );
      const user = userCredential.user;

      // 2. Crear el documento de usuario en Firestore
      await setDoc(doc(db, "usuarios", user.uid), {
        nombre: formData.nombre,
        correo: formData.correo,
        activo: true, // Establecer el estado inicial de la cuenta como activo
        fecha_registro: serverTimestamp(),
      });

      mostrarNotificacion(
        "Cuenta creada correctamente. ¡Ya puedes iniciar sesión!",
        "exito"
      ); // Notificación de éxito

      // ✅ Redirección correcta después del registro
      navigate("/login");
    } catch (error) {
      // 🛑 PASO CLAVE: Imprimir el error completo para debug
      console.error("Error completo de Firebase Auth:", error);

      let mensajeError = "Ocurrió un error desconocido al registrar la cuenta.";

      // Manejo de errores específicos de Firebase para mensajes más amigables
      switch (error.code) {
        case "auth/email-already-in-use":
          mensajeError =
            "Este correo electrónico ya está registrado. Por favor, usa otro o inicia sesión.";
          break;
        case "auth/invalid-email":
          mensajeError = "El formato del correo electrónico es inválido.";
          break;
        case "auth/weak-password":
          // Aunque la validación local previene esto, es un buen guardián.
          mensajeError =
            "La contraseña es demasiado débil. Debe tener al menos 6 caracteres (aunque tu validación requiere 7 dígitos).";
          break;
        default:
          // Si es otro error, mostramos el mensaje de error original
          mensajeError = `Error de Firebase: ${error.message}`;
      }

      mostrarNotificacion(mensajeError, "error");
    }
  };

  return (
    <div className="registro-container">
      <div className="registro-box">
        {/* 🖼️ Uso del Logo */}
        <img src={Logo} alt="Logo de Jewelry" className="registro-logo" />
        <h2 className="registro-title">Crear Cuenta</h2>

        <form className="registro-form" onSubmit={handleSubmit}>
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

          <div className="registro-boton-container">
            <button type="submit" className="btn-aceptar">
              Aceptar
            </button>
          </div>
        </form>

        <p className="registro-info">
          Esta plataforma es un sistema de apartado
        </p>
      </div>
    </div>
  );
};

export default Registrarse;