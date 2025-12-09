// src/components/Login.jsx

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
// 🆕 Importamos query, collection, where y getDocs para buscar en Firestore
import { doc, getDoc, query, collection, where, getDocs } from "firebase/firestore"; 
import "../style/Login.css";

// 🖼️ Importación del Logo (Asegúrate de que la ruta sea correcta)
import Logo from "../assets/Logo.png"; 

const Login = ({ mostrarNotificacion }) => {
  const navigate = useNavigate();
  
  // 🛑 Cambiamos el estado para solo tener el identificador y la contraseña
  const [formData, setFormData] = useState({
    identificador: "", // Puede ser nombre O correo
    contraseña: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 🔑 Función de ayuda para determinar si el input es un correo
  const esCorreo = (input) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { identificador, contraseña } = formData;
    let emailParaLogin = "";

    const contraseñaValida = /^[0-9]{7}$/.test(contraseña);

    if (!contraseñaValida) return mostrarNotificacion("La contraseña debe tener exactamente 7 números.", 'error');

    try {
      if (esCorreo(identificador)) {
        // Caso 1: Se ingresó un correo electrónico
        emailParaLogin = identificador;
      } else {
        // Caso 2: Se ingresó un nombre de usuario (NO es un correo)
        const usersRef = collection(db, "usuarios");
        // Buscamos en Firestore el documento cuyo campo 'nombre' coincida con el identificador
        const q = query(usersRef, where("nombre", "==", identificador));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          throw new Error("Nombre de usuario no encontrado.");
        }
        
        // Si encontramos un documento, usamos el correo de ese documento
        const userData = querySnapshot.docs[0].data();
        emailParaLogin = userData.correo;
      }

      // 1. Intentar iniciar sesión con el correo encontrado/ingresado
      const userCredential = await signInWithEmailAndPassword(auth, emailParaLogin, contraseña);
      const user = userCredential.user;

      // 2. 🔑 Verificar el estado de la cuenta en Firestore (la lógica es la misma)
      const userDocRef = doc(db, "usuarios", user.uid);
      const userDoc = await getDoc(userDocRef);
      
      const userData = userDoc.data();

      if (userDoc.exists() && userData.activo === false) {
        await signOut(auth);
        mostrarNotificacion("Tu cuenta ha sido desactivada. Por favor, contacta a soporte.", 'error');
        return;
      }
      
      mostrarNotificacion(`Bienvenido, ${userData.nombre}. Sesión iniciada.`, 'exito');
      navigate("/compra");
    } catch (error) {
      let mensajeError = error.message;
      
      // Mejora de mensajes de error de Firebase
      if (error.code === 'auth/invalid-credential') {
        mensajeError = 'Credenciales inválidas. Correo/Nombre de usuario o contraseña incorrectos.';
      } else if (error.message.includes("Nombre de usuario no encontrado")) {
        mensajeError = 'El nombre de usuario no existe.';
      }
      
      mostrarNotificacion(`Error al iniciar sesión: ${mensajeError}`, 'error');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        {/* 🖼️ Uso del Logo */}
        <img src={Logo} alt="Logo de Jewelry" className="login-logo" />
        <h2 className="login-title">Iniciar Sesión</h2>

        <form className="login-form" onSubmit={handleSubmit}>
          {/* 🆕 Campo único para Nombre o Correo */}
          <label htmlFor="identificador">Correo</label>
          <input
            type="text"
            id="identificador"
            name="identificador"
            placeholder="Tu @gmail.com"
            value={formData.identificador}
            onChange={handleChange}
            required
          />
          {/* 🛑 Eliminamos los campos de nombre y correo separados */}

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