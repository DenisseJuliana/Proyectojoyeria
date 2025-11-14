import React, { useState } from "react";
import aretesorolaminado1 from "../assets/aretesrorolaminado1.png";
import anillodeplata1 from "../assets/anillodeplata1.png";
import "../style/Compra.css"; 
import { getAuth, signOut, deleteUser } from "firebase/auth";
// 💡 Importar el componente de Notificación
import Notificacion from './Notificacion'; 
// 💡 Importar Carrito (si lo vas a usar como componente aparte)
import Carrito from './Carrito'; 


// 💡 Se mantiene la propiedad 'descuento' (boolean) en los productos.
const productosData = [
  {
    id: 1,
    nombre: "Aros oro laminado",
    categoria: "Aretes",
    material: "Oro Laminado",
    precio: 10,
    imagen: aretesorolaminado1,
    descuento: true, // Producto en oferta
  },
  {
    id: 2,
    nombre: "Anillo de plata",
    categoria: "Anillos",
    material: "Plata",
    precio: 25,
    imagen: anillodeplata1,
    descuento: false, // Producto SIN oferta
  },
  {
    id: 3,
    nombre: "Collar elegante",
    categoria: "Collares",
    material: "Acero",
    precio: 30,
    imagen: "https://via.placeholder.com/100",
    descuento: true, // Producto en oferta
  },
  {
    id: 4,
    nombre: "Pulsera de acero",
    categoria: "Pulseras",
    material: "Acero",
    precio: 20,
    imagen: "https://via.placeholder.com/100",
    descuento: false, // Producto SIN oferta
  },
  {
    id: 5,
    nombre: "Aros de plata",
    categoria: "Aretes",
    material: "Plata",
    precio: 15,
    imagen: "https://via.placeholder.com/100",
    descuento: true, // Producto en oferta
  },
];

const Compra = () => {
  const [vista, setVista] = useState("inicio");
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todo");
  const [busqueda, setBusqueda] = useState("");
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  // Estado para el carrito de compras (lista de productos)
  const [carrito, setCarrito] = useState([]);
  // Estado para la forma de pago en la vista del carrito
  const [formaPago, setFormaPago] = useState("Efectivo");

    // 🆕 Estado para la notificación flotante
    const [notificacion, setNotificacion] = useState({
        mensaje: '',
        tipo: '', // 'exito', 'error', 'default'
    });

  const auth = getAuth();
    
    // 🆕 Función para mostrar la notificación
    const mostrarNotificacion = (mensaje, tipo = 'default') => {
        setNotificacion({ mensaje, tipo });
    };


  // --- Funciones de Sesión (alert reemplazado por mostrarNotificacion o mantenido si es necesario) ---
  const cerrarSesion = async () => {
    await signOut(auth);
    mostrarNotificacion("Sesión cerrada correctamente", 'default'); // ✅
  };

  const eliminarCuenta = async () => {
    const usuario = auth.currentUser;
    // Se mantiene el window.confirm por ser una acción destructiva de la cuenta
    if (usuario && confirm("¿Seguro que deseas eliminar tu cuenta?")) { 
      await deleteUser(usuario);
      mostrarNotificacion("Cuenta eliminada.", 'default'); // ✅
    }
  };

  // --- Funciones del Modal (sin cambios) ---
  const abrirModalProducto = (producto) => {
    setProductoSeleccionado(producto);
  };

  const cerrarModalProducto = () => {
    setProductoSeleccionado(null);
  };

  // --- Funciones del Carrito 🛒 ---

  // 1. Agregar al Carrito (alert reemplazado por mostrarNotificacion)
  const agregarAlCarrito = (producto) => {
    setCarrito((prevCarrito) => [...prevCarrito, producto]);
    mostrarNotificacion(`Se agregó "${producto.nombre}" al carrito!`, 'exito'); // ✅
    cerrarModalProducto();
  };

  // 2. Abrir la vista del Carrito (Funciona correctamente)
  const abrirCarrito = () => {
    setVista("carrito");
  };

  // 3. Eliminar Producto del Carrito (alert reemplazado por mostrarNotificacion)
  const eliminarDelCarrito = (indexParaEliminar) => {
    const nuevoCarrito = carrito.filter((_, index) => index !== indexParaEliminar);
    setCarrito(nuevoCarrito);
    mostrarNotificacion(`Producto eliminado del carrito.`, 'default'); // ✅
  };

  // 4. Volver a la Compra con confirmación (MODIFICADO: Eliminando window.confirm())
  const volverACompra = () => {
    // ❌ Se elimina window.confirm() para evitar la ventana de diálogo nativa.
    if (carrito.length > 0) {
      // Ahora, al regresar, el carrito se guarda automáticamente y solo se notifica.
      mostrarNotificacion("Tu carrito se ha guardado. Puedes volver a él desde el botón Carrito.", 'default'); 
    }
    setVista("inicio");
  };

  // 5. Calcular el total (Funciona correctamente)
  const calcularTotal = () => {
    return carrito.reduce((total, producto) => total + producto.precio, 0).toFixed(2);
  };

  // --- Filtrado de Productos (sin cambios) ---
  const productosFiltrados = productosData.filter((producto) => {
    const coincideCategoria =
      categoriaFiltro === "Todo" || producto.categoria === categoriaFiltro;
    const coincideBusqueda = producto.nombre
      .toLowerCase()
      .includes(busqueda.toLowerCase());
    return coincideCategoria && coincideBusqueda;
  });

  const productosEnOferta = productosData.filter(
    (producto) => producto.descuento
  );

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
      </aside>

      {/* 🛍 Contenido dinámico */}
      <main className="contenido-principal">
        {/* ⬆️ Botones de sesión */}
        <div className="acciones-top">
          <button className="cerrar" onClick={cerrarSesion}>
            Cerrar sesión
          </button>
          <button className="eliminar" onClick={eliminarCuenta}>
            Eliminar cuenta
          </button>
        </div>

        {/* Vista INICIO (Compra) */}
        {vista === "inicio" && (
          <section>
            <h2>Explora nuestra Joyería</h2>
            <p>
              Bienvenido a Jewelry, el sistema de apartado favorito en joyeria 💍
            </p>

            {/* Barra de búsqueda */}
            <div className="contenedor-busqueda">
              <span className="icono-lupa">🔍</span>
              <input
                type="text"
                placeholder="Buscar producto..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="barra-busqueda"
              />
            </div>

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
                <li
                  key={producto.id}
                  className={`producto-item ${
                    producto.descuento ? "producto-oferta" : ""
                  }`}
                  onClick={() => abrirModalProducto(producto)}
                >
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
                      {producto.descuento && (
                        <span className="tag-oferta"> (¡Oferta!)</span>
                      )}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Vista OFERTAS */}
        {vista === "ofertas" && (
          <section>
            <h1>Ofertas Especiales ✨</h1>
            {productosEnOferta.length > 0 ? (
              <ul className="lista-productos">
                {productosEnOferta.map((producto) => (
                  <li
                    key={producto.id}
                    className="producto-item producto-oferta"
                    onClick={() => abrirModalProducto(producto)}
                  >
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
                        <span className="tag-oferta"> (¡En Descuento!)</span>
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No hay ofertas disponibles en este momento.</p>
            )}
          </section>
        )}

        {/* Vista TICKETS */}
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

        {/* Vista TIENDA FÍSICA */}
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

        {/* 🆕 Vista CARRITO DE COMPRAS - Ahora usa el componente Carrito.jsx */}
        {vista === "carrito" && (
            <Carrito 
                carrito={carrito}
                eliminarDelCarrito={eliminarDelCarrito}
                volverACompra={volverACompra}
                calcularTotal={calcularTotal}
                formaPago={formaPago} // Pasar el estado de pago
                setFormaPago={setFormaPago} // Pasar la función de actualización
                mostrarNotificacion={mostrarNotificacion} // 🆕 Pasar la función de notificación
            />
        )}
      </main>

      {/* 🛒 Carrito flotante (Botón) */}
      <button
        className="boton-carrito"
        onClick={abrirCarrito} 
      >
        🛒 Carrito ({carrito.length})
      </button>

      {/* 🖼️ Modal de Detalle de Producto */}
      {productoSeleccionado && (
        <div className="modal-overlay" onClick={cerrarModalProducto}>
          <div
            className="modal-producto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <button className="boton-cerrar" onClick={cerrarModalProducto}>
                ← Volver
              </button>
              <h2>Detalle del Producto</h2>
            </div>
            <div className="modal-body">
              <img
                src={productoSeleccionado.imagen}
                alt={productoSeleccionado.nombre}
                className="modal-imagen"
              />
              <h3>{productoSeleccionado.nombre}</h3>
              <p>
                **Categoría:** {productoSeleccionado.categoria}
              </p>
              <p>
                **Material:** {productoSeleccionado.material}
              </p>
              <p className="modal-precio">
                **Precio:** **${productoSeleccionado.precio}**
                {productoSeleccionado.descuento && (
                  <span className="tag-oferta-modal"> ¡Oferta!</span>
                )}
              </p>
            </div>
            <div className="modal-footer">
              <button
                className="boton-agregar-carrito"
                onClick={() => agregarAlCarrito(productoSeleccionado)}
              >
                🛒 Agregar al Carrito
              </button>
            </div>
          </div>
        </div>
      )}

        {/* 🆕 COMPONENTE DE NOTIFICACIÓN FLOTANTE */}
        <Notificacion 
            mensaje={notificacion.mensaje} 
            tipo={notificacion.tipo} 
            onClose={() => setNotificacion({ mensaje: '', tipo: '' })} 
        />
    </div>
  );
};

export default Compra;