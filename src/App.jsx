import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Bienvenida from "./components/Bienvenida";
import Login from "./components/Login";
import Registrarse from "./components/Registrarse";
import Compra from "./components/Compra";
import Notificacion from "./components/Notificacion"; // 👈 IMPORTADO para usarlo globalmente

function App() {
    // 1. ⚙️ Estado para la notificación global
    const [notificacion, setNotificacion] = useState({
        mensaje: '',
        tipo: '', 
    });

    // 2. 📝 Función que define y muestra la notificación (Global)
    const mostrarNotificacion = (mensaje, tipo = 'default') => {
        setNotificacion({ mensaje, tipo });
    };

    // 3. ❌ Función para cerrar la notificación (pasada al componente Notificacion)
    const cerrarNotificacion = () => {
        setNotificacion({ mensaje: '', tipo: '' });
    };

    return (
        <Router>
            {/* 4. Renderiza la notificación globalmente, fuera de las rutas */}
            <Notificacion
                mensaje={notificacion.mensaje}
                tipo={notificacion.tipo}
                onClose={cerrarNotificacion}
            />

            <Routes>
                {/* Ruta principal */}
                <Route path="/" element={<Bienvenida />} />

                {/* 5. ✅ Pasar la prop mostrarNotificacion a los componentes de Formulario */}
                <Route 
                    path="/login" 
                    element={<Login mostrarNotificacion={mostrarNotificacion} />} 
                />
                <Route 
                    path="/registro" 
                    element={<Registrarse mostrarNotificacion={mostrarNotificacion} />} 
                />

                {/* 6. ✅ Pasar la prop mostrarNotificacion al componente de Compra */}
                <Route 
                    path="/compra" 
                    element={<Compra mostrarNotificacion={mostrarNotificacion} />} 
                />
            </Routes>
        </Router>
    );
}

export default App;