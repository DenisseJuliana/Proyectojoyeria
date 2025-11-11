import React, { useState } from "react";
import "../style/Compra.css";
import { getAuth, signOut, deleteUser } from "firebase/auth";

const productosData = [
  {
    id: 1,
    nombre: "Aros oro laminado",
    categoria: "Aretes",
    material: "Oro Laminado",
    precio: 10,
    imagen: "https://via.placeholder.com/100", // reemplaza con la URL real
  },
  {
    id: 2,
    nombre: "Anillo de plata",
    categoria: "Anillos",
    material: "Plata",
    precio: 25,
    imagen: "https://via.placeholder.com/100",
  },
  {
    id: 3,
    nombre: "Collar elegante",
    categoria: "Collares",
    material: "Acero",
    precio: 30,
    imagen: "https://via.placeholder.com/100",
  },
  {
    id: 4,
    nombre: "Pulsera de acero",
    categoria: "Pulseras",
    material: "Acero",
    precio: 20,
    imagen: "https://via.placeholder.com/100",
  },
  {
    id: 5,
    nombre: "Aros de plata",
    categoria: "Aretes",
    material: "Plata",
    precio: 15,
    imagen: "https://via.placeholder.com/100",
  },
];

const Compra = () => {
  const [vista, setVista] = useState("inicio");
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todo");
  const [busqueda, setBusqueda] = useState("");
  const auth = getAuth();

  const cerrarSesion = async () => {
    await signOut(auth);
    alert("Sesión cerrada correctamente");
  };

  const eliminarCuenta = async () => {
    const usuario = auth.currentUser;
    if (usuario && confirm("¿Seguro que deseas eliminar tu cuenta?")) {
      await deleteUser(usuario);
      alert("Cuenta eliminada.");
    }
  };

  // Filtrar productos por categoría y búsqueda
  const productosFiltrados = productosData.filter((producto) => {
    const coincideCategoria =
      categoriaFiltro === "Todo" || producto.categoria === categoriaFiltro;
    const coincideBusqueda = producto.nombre
      .toLowerCase()
      .includes(busqueda.toLowerCase());
    return coincideCategoria && coincideBusqueda;
  });

  return (
    <div className="compra-layout">
      {/* 🟢 Menú lateral */}
      <aside className="menu-lateral">
        <h2>Jewelry ✨</h2>

        <nav className="menu-opciones">
          <button
            className={vista === "inicio" ? "activo" : ""}
            onClick={() => setVista("inicio")}
          >
            Inicio / Compra
          </button>
          <button
            className={vista === "ofertas" ? "activo" : ""}
            onClick={() => setVista("ofertas")}
          >
            Ofertas
          </button>
          <button
            className={vista === "tickets" ? "activo" : ""}
            onClick={() => setVista("tickets")}
          >
            Tickets
          </button>
          <button
            className={vista === "tienda" ? "activo" : ""}
            onClick={() => setVista("tienda")}
          >
            Tienda Física
          </button>
        </nav>

        <div className="acciones">
          <button className="cerrar" onClick={cerrarSesion}>
            Cerrar sesión
          </button>
          <button className="eliminar" onClick={eliminarCuenta}>
            Eliminar cuenta
          </button>
        </div>
      </aside>

      {/* 🛍 Contenido dinámico */}
      <main className="contenido-principal">
        {vista === "inicio" && (
          <section>
            <h1>Inicio / Compra</h1>
            <p>Bienvenido a Jewelry, el sistema de apartado 💍</p>

            {/* Barra de búsqueda */}
            <input
              type="text"
              placeholder="Buscar producto..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="barra-busqueda"
            />

            {/* Botones de filtro */}
            <div className="filtros">
              {["Todo", "Aretes", "Anillos", "Collares", "Pulseras"].map(
                (cat) => (
                  <button
                    key={cat}
                    className={categoriaFiltro === cat ? "activo" : ""}
                    onClick={() => setCategoriaFiltro(cat)}
                  >
                    {cat}
                  </button>
                )
              )}
            </div>

            {/* Lista de productos */}
            <ul className="lista-productos">
              {productosFiltrados.map((producto) => (
                <li key={producto.id} className="producto-item">
                  <img
                    src={producto.imagen}
                    alt={producto.nombre}
                    width={80}
                    height={80}
                  />
                  <div className="producto-info">
                    <h3>{producto.nombre}</h3>
                    <p>
                      <strong>Material:</strong> {producto.material}
                    </p>
                    <p>
                      <strong>Precio:</strong> ${producto.precio}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Ofertas */}
        {vista === "ofertas" && (
          <section>
            <h1>Ofertas 💎</h1>
            <ul className="lista-productos">
              <li>
                Aros oro laminado <span>$10</span>
              </li>
              <li>
                Pulsera de acero <span>$20</span>
              </li>
            </ul>
          </section>
        )}

        {/* Tickets */}
        {vista === "tickets" && (
          <section>
            <h1>Mis Tickets 🧾</h1>
            <table>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Total</th>
                  <th>Método</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>10/10/25</td>
                  <td>$80</td>
                  <td>Efectivo</td>
                </tr>
                <tr>
                  <td>05/10/25</td>
                  <td>$45</td>
                  <td>Tarjeta</td>
                </tr>
              </tbody>
            </table>
          </section>
        )}

        {/* Tienda Física */}
        {vista === "tienda" && (
          <section>
            <h1>Tienda Física 🏬</h1>
            <p>
              <strong>Dirección:</strong> Calle Legua n.06 Tecamac Centro
            </p>
            <p>
              <strong>Horario:</strong> Lunes a sábado 9:00 AM - 6:00 PM
            </p>
            <a
              href="https://www.google.com/maps/place/Cecytem+Plantel+Tec%C3%A1mac/@19.723988,-98.97122,17z/data=!4m6!3m5!1s0x85d1924db880b35f:0xf570ece6fd6cee96!8m2!3d19.7241211!4d-98.9713088!16s%2Fg%2F1tg8k1p9?hl=es-419&entry=ttu&g_ep=EgoyMDI1MTEwNS4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              className="boton-mapa"
            >
              📍 Cómo llegar
            </a>
          </section>
        )}
      </main>
    </div>
  );
};

export default Compra;
