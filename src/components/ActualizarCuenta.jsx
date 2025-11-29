// src/components/ActualizarCuenta.jsx

import React, { useState, useEffect } from "react";
// Importación del Logo (usando la ruta relativa correcta: subir un nivel y entrar en assets)
import Logo from "../assets/Logo.png"; 

// 🔑 Importaciones de Firebase Auth y Firestore
import { 
    getAuth, 
    updateEmail, 
    updatePassword, 
    reauthenticateWithCredential, 
    EmailAuthProvider,
} from 'firebase/auth'; 
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from "../firebase"; 
import "../style/ActualizarCuenta.css"; 

const ActualizarCuenta = ({ mostrarNotificacion, setVista }) => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    // Estado para almacenar los datos actuales del usuario
    const [userData, setUserData] = useState({
      nombre: '',
      correo: '',
    });

    // Estado para los cambios que el usuario quiere hacer
    const [formData, setFormData] = useState({
      nuevoNombre: '',
      nuevoCorreo: '',
      nuevaContraseña: '',
      confirmacionContraseña: '',
      contraseñaActual: '', // Necesaria para re-autenticar
    });
    
    // Cargar los datos actuales del usuario al montar el componente
    useEffect(() => {
        const fetchUserData = async () => {
            if (currentUser) {
                try {
                    const userDocRef = doc(db, "usuarios", currentUser.uid);
                    const userDoc = await getDoc(userDocRef);
                    if (userDoc.exists()) {
                        const data = userDoc.data();
                        // Seteamos el estado con los datos actuales
                        setUserData({ 
                            nombre: data.nombre, 
                            correo: currentUser.email || data.correo // Usamos el de Auth si es posible
                        });
                        // Pre-rellenamos el formulario de actualización con el nombre actual
                        setFormData(prev => ({ ...prev, nuevoNombre: data.nombre, nuevoCorreo: currentUser.email || data.correo }));
                    }
                } catch (error) {
                    console.error("Error al cargar datos de usuario:", error);
                    mostrarNotificacion("Error al cargar datos de tu perfil.", 'error');
                }
            }
        };
        fetchUserData();
    }, [currentUser, mostrarNotificacion]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // 🔑 Función para re-autenticar al usuario (NECESARIO para cambiar correo/contraseña)
    const reautenticarUsuario = async () => {
        const credential = EmailAuthProvider.credential(
            currentUser.email, 
            formData.contraseñaActual
        );
        await reauthenticateWithCredential(currentUser, credential);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        
        if (!currentUser) {
            mostrarNotificacion("Debes iniciar sesión para actualizar tu cuenta.", 'error');
            return;
        }

        let cambiosHechos = false;

        // --- PRE-CHECK: Determinar cambios y necesidad de reautenticación ---
        const cambiarNombre = formData.nuevoNombre && formData.nuevoNombre !== userData.nombre;
        const cambiarCorreo = formData.nuevoCorreo && formData.nuevoCorreo !== currentUser.email;
        const cambiarContraseña = formData.nuevaContraseña;
        const necesitaReautenticar = cambiarCorreo || cambiarContraseña;

        // 1. Actualizar NOMBRE (se actualiza en Firestore)
        if (cambiarNombre) {
            try {
                const userDocRef = doc(db, "usuarios", currentUser.uid);
                await updateDoc(userDocRef, { nombre: formData.nuevoNombre });
                
                setUserData(prev => ({ ...prev, nombre: formData.nuevoNombre }));
                mostrarNotificacion("Nombre actualizado con éxito en el sistema.", 'exito');
                cambiosHechos = true;
            } catch (error) {
                console.error("Error al actualizar nombre:", error);
                mostrarNotificacion(`Error al actualizar nombre: ${error.message}`, 'error');
                return;
            }
        }

        // --- BLOQUE 2: REAUTENTICACIÓN (Obligatoria para correo/contraseña) ---
        if (necesitaReautenticar) {
            if (!formData.contraseñaActual) {
                mostrarNotificacion("Introduce tu contraseña actual para confirmar el cambio de correo o contraseña.", 'alerta');
                return;
            }
            
            try {
                await reautenticarUsuario();
                mostrarNotificacion("Identidad verificada. Procesando cambios sensibles...", 'default');
            } catch (error) {
                console.error("Error durante la reautenticación:", error);
                
                if (error.code === 'auth/wrong-password') {
                    mostrarNotificacion("Contraseña actual incorrecta. No se pudo verificar tu identidad.", 'error');
                } else if (error.code === 'auth/requires-recent-login') {
                    mostrarNotificacion("Tu sesión de inicio expiró. Por seguridad, cierra sesión y vuelve a iniciarla para hacer cambios de seguridad.", 'error');
                } else if (error.code === 'auth/invalid-credential') {
                    mostrarNotificacion("Error: Tu cuenta no tiene una contraseña asociada (probablemente te registraste con Google/Redes Sociales).", 'error');
                } else {
                    mostrarNotificacion(`Error de verificación de identidad: ${error.message}`, 'error');
                }
                
                return; 
            }
        }
        // --- FIN DE BLOQUE DE REAUTENTICACIÓN ---

        // 3. Actualizar CORREO 
        if (cambiarCorreo) {
            try {
                await updateEmail(currentUser, formData.nuevoCorreo);
                
                // Actualizar el correo también en Firestore
                const userDocRef = doc(db, "usuarios", currentUser.uid);
                await updateDoc(userDocRef, { correo: formData.nuevoCorreo });
                
                setUserData(prev => ({ ...prev, correo: formData.nuevoCorreo }));
                mostrarNotificacion("Correo actualizado con éxito. Recuerda que no es un correo real.", 'exito');
                cambiosHechos = true;
            } catch (error) {
                console.error("Error al actualizar correo:", error);
                
                if (error.code === 'auth/email-already-in-use') {
                    mostrarNotificacion("Ese correo ya está registrado por otra cuenta.", 'error');
                } else if (error.code === 'auth/operation-not-allowed') {
                    // Muestra un mensaje para guiar al usuario a la consola
                    mostrarNotificacion("Error de estado. Por favor, desactiva la 'Protección de enumeración de correo electrónico' en Firebase Console y espera a que expire el cambio anterior.", 'error');
                } else {
                    mostrarNotificacion(`Error al actualizar correo: ${error.message}`, 'error');
                }
                return;
            }
        }

        // 4. Actualizar CONTRASEÑA 
        if (cambiarContraseña) {
            if (formData.nuevaContraseña.length !== 7 || !/^[0-9]{7}$/.test(formData.nuevaContraseña)) {
                mostrarNotificacion("La nueva contraseña debe tener exactamente 7 números.", 'alerta');
                return;
            }
            if (formData.nuevaContraseña !== formData.confirmacionContraseña) {
                mostrarNotificacion("Las contraseñas no coinciden.", 'alerta');
                return;
            }
            
            try {
                await updatePassword(currentUser, formData.nuevaContraseña);
                mostrarNotificacion("Contraseña actualizada con éxito.", 'exito');
                cambiosHechos = true;
            } catch (error) {
                console.error("Error al actualizar contraseña:", error);
                mostrarNotificacion(`Error al actualizar contraseña: ${error.message}`, 'error');
                return;
            }
        }

        if (cambiosHechos) {
            // Limpiar los campos sensibles
            setFormData(prev => ({ 
                ...prev, 
                nuevaContraseña: '', 
                confirmacionContraseña: '', 
                contraseñaActual: '' 
            }));
            // Volver a la vista de inicio
            setVista("inicio"); 
        } else {
            mostrarNotificacion("No se realizaron cambios. Por favor, modifica al menos un campo.", 'default');
        }
    };

    return (
        <section className="actualizar-cuenta-container">
            {/* INICIO: AGREGAMOS EL LOGO */}
            <div className="actualizar-header">
                <img 
                    src={Logo} 
                    alt="Logo de Jewelry" 
                    className="actualizar-logo" 
                />
            </div>
            {/* FIN: AGREGAMOS EL LOGO */}

            <button className="boton-volver" onClick={() => setVista("inicio")}>
                ← Volver a la Tienda
            </button>
            <h1>Actualizar Cuenta </h1>
            <p className="info-usuario">
                Estás conectado como **{userData.nombre}** ({userData.correo})
            </p>
            <form onSubmit={handleUpdate} className="update-form">
                
                <h2>Actualizar Nombre de Usuario</h2>
                <label htmlFor="nuevoNombre">Nuevo Nombre (Actual: {userData.nombre})</label>
                <input
                    type="text"
                    id="nuevoNombre"
                    name="nuevoNombre"
                    value={formData.nuevoNombre}
                    onChange={handleChange}
                    placeholder="Ingresa un nuevo nombre"
                />

                <hr/>

                <h2>Actualizar Correo</h2>
                <label htmlFor="nuevoCorreo">Nuevo Correo (Actual: {userData.correo})</label>
                <input
                    type="email"
                    id="nuevoCorreo"
                    name="nuevoCorreo"
                    value={formData.nuevoCorreo}
                    onChange={handleChange}
                    placeholder="Ingresa un nuevo correo electrónico"
                />
                
                <hr/>

                <h2>Actualizar Contraseña</h2>
                <label htmlFor="nuevaContraseña">Nueva Contraseña (7 dígitos)</label>
                <input
                    type="password"
                    id="nuevaContraseña"
                    name="nuevaContraseña"
                    value={formData.nuevaContraseña}
                    onChange={handleChange}
                    placeholder="Ingresa la nueva contraseña"
                    maxLength="7"
                />
                <label htmlFor="confirmacionContraseña">Confirmar Nueva Contraseña</label>
                <input
                    type="password"
                    id="confirmacionContraseña"
                    name="confirmacionContraseña"
                    value={formData.confirmacionContraseña}
                    onChange={handleChange}
                    placeholder="Confirma la nueva contraseña"
                    maxLength="7"
                />
                
                <hr/>

                {/* Campo obligatorio para seguridad si se cambia correo o contraseña */}
                <h2 style={{marginTop: '30px'}}>Confirmación de Seguridad</h2>
                <p className="alerta-seguridad">
                    **IMPORTANTE:** Debes ingresar tu contraseña actual para confirmar cambios de Correo o Contraseña.
                </p>
                <label htmlFor="contraseñaActual">Contraseña Actual (Requerida)</label>
                <input
                    type="password"
                    id="contraseñaActual"
                    name="contraseñaActual"
                    value={formData.contraseñaActual}
                    onChange={handleChange}
                    placeholder="Tu contraseña actual (7 dígitos)"
                    maxLength="7"
                />

                <button type="submit" className="btn-actualizar">
                    Guardar Cambios
                </button>
            </form>
        </section>
    );
};

export default ActualizarCuenta;