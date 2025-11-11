import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Bienvenida from "./components/Bienvenida";
import Login from "./components/Login";
import Registrarse from "./components/Registrarse";
import Compra from "./components/Compra"; // 👈 nueva importación

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta principal (pantalla de bienvenida) */}
        <Route path="/" element={<Bienvenida />} />

        {/* Ruta del login */}
        <Route path="/login" element={<Login />} />

        {/* Ruta de registro */}
        <Route path="/registro" element={<Registrarse />} />

        {/* ✅ Nueva ruta de la pantalla de compra */}
        <Route path="/compra" element={<Compra />} />
      </Routes>
    </Router>
  );
}

export default App;
