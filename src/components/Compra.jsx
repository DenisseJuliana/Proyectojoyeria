import React, { useState } from "react";
// 🖼️ Importaciones de imágenes
import aretesorolaminado1 from "../assets/aretesrorolaminado1.png";
import anillodeplata1 from "../assets/anillodeplata1.png";
import collar1 from "../assets/collar1.png";
import pulcera1 from "../assets/pulcera1.png";
import arosplateados1 from "../assets/arosplateados1.png";
import "../style/Compra.css";

// 🔐 Importaciones de Firebase Auth
import { getAuth, signOut, deleteUser } from "firebase/auth";

// 📦 Importaciones de Componentes
import Notificacion from './Notificacion';
import Carrito from './Carrito';
import TicketPDF from './TicketPDF'; 

// 🆕 IMPORTACIONES DE FIREBASE FIRESTORE
// Asegúrate de que 'db' y 'serverTimestamp' se exporten desde tu archivo de configuración
import { db, serverTimestamp } from '../firebase'; 
import { collection, addDoc, doc, setDoc } from "firebase/firestore";


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
    nombre: "Anillo de plata con estrella, zafiro azul",
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
    imagen: collar1,
    descuento: true, // Producto en oferta
  },
  {
    id: 4,
    nombre: "Pulsera de acero",
    categoria: "Pulseras",
    material: "Acero",
    precio: 20,
    imagen: pulcera1,
    descuento: false, // Producto SIN oferta
  },
  {
    id: 5,
    nombre: "Aros de plata",
    categoria: "Aretes",
    material: "Plata",
    precio: 15,
    imagen: arosplateados1,
    descuento: true, // Producto en oferta
  },
];

const Compra = () => {
    // --- Estados de la Aplicación ---
    const [vista, setVista] = useState("inicio");
    const [categoriaFiltro, setCategoriaFiltro] = useState("Todo");
    const [busqueda, setBusqueda] = useState("");
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [carrito, setCarrito] = useState([]);
    const [formaPago, setFormaPago] = useState("Efectivo");
    // Almacena localmente los tickets generados
    const [ticketsGuardados, setTicketsGuardados] = useState([]); 

    // Estado para el ticket recién generado (usado en la vista de éxito)
    const [lastTicket, setLastTicket] = useState(null); 
    
    // Estado para la notificación flotante
    const [notificacion, setNotificacion] = useState({
        mensaje: '',
        tipo: '', // 'exito', 'error', 'default'
    });

    const auth = getAuth();
    // 💡 Obtener información del usuario actual para auditoría
    const currentUser = auth.currentUser;
    // Usamos el UID si está conectado, si no, un valor por defecto
    const currentUserId = currentUser ? currentUser.uid : 'Anonimo_Desconectado';

    // Función para mostrar la notificación
    const mostrarNotificacion = (mensaje, tipo = 'default') => {
        setNotificacion({ mensaje, tipo });
    };

    // ----------------------------------------------------
    // 🔑 FUNCIÓN PARA GUARDAR LA COMPRA EN FIRESTORE
    // ----------------------------------------------------
    const savePurchaseToFirestore = async (purchaseRecord) => {
        try {
            const comprasCollection = collection(db, "compras");
            
            // Añade el registro completo a la colección 'compras'
            const docRef = await addDoc(comprasCollection, purchaseRecord);
            console.log("Compra guardada en Firestore con ID:", docRef.id);
            
            mostrarNotificacion(`Ticket guardado en DB con ID: ${docRef.id.substring(0, 4)}...`, 'default');
            
        } catch (error) {
            console.error("Error al guardar la compra en Firestore:", error);
            mostrarNotificacion("Error al guardar el ticket en la base de datos.", 'error');
        }
    };

    // --- Funciones de Sesión (sin cambios) ---
    const cerrarSesion = async () => {
        await signOut(auth);
        mostrarNotificacion("Sesión cerrada correctamente", 'default');
    };

    const eliminarCuenta = async () => {
        const usuario = auth.currentUser;
        if (usuario && confirm("¿Seguro que deseas eliminar tu cuenta?")) {
            await deleteUser(usuario);
            mostrarNotificacion("Cuenta eliminada.", 'default');
        }
    };

    // --- Funciones del Modal y Carrito ---
    const abrirModalProducto = (producto) => {
        setProductoSeleccionado(producto);
    };

    const cerrarModalProducto = () => {
        setProductoSeleccionado(null);
    };

    const agregarAlCarrito = (producto) => {
        setCarrito((prevCarrito) => [...prevCarrito, producto]);
        mostrarNotificacion(`Se agregó "${producto.nombre}" al carrito!`, 'exito');
        cerrarModalProducto();
    };

    const abrirCarrito = () => {
        setVista("carrito");
    };

    const eliminarDelCarrito = (indexParaEliminar) => {
        const nuevoCarrito = carrito.filter((_, index) => index !== indexParaEliminar);
        setCarrito(nuevoCarrito);
        mostrarNotificacion(`Producto eliminado del carrito.`, 'default');
    };

    const volverACompra = () => {
        if (carrito.length > 0) {
            mostrarNotificacion("Tu carrito se ha guardado. Puedes volver a él desde el botón Carrito.", 'default');
        }
        setVista("inicio");
    };

    const calcularTotal = () => {
        return carrito.reduce((total, producto) => total + producto.precio, 0).toFixed(2);
    };

    const limpiarCarrito = () => {
        setCarrito([]);
        setFormaPago('Efectivo'); 
    };

    const volverAInicio = () => {
        setLastTicket(null); 
        setVista("inicio");
    }


    // ----------------------------------------------------
    // 🔑 FUNCIÓN PRINCIPAL DE FINALIZACIÓN DE COMPRA
    // ----------------------------------------------------
    const guardarTicketYLimpiarCarrito = (ticket) => {
        // Obtenemos una marca de tiempo local para el campo fecha_compra (referencia legible)
        const localTime = new Date().toISOString(); 
        
        // 1. Crear el objeto completo del ticket con campos de auditoría
        const purchaseRecord = {
            ...ticket, // ID local, total, productos, formaPago
            
            // 💡 Campos de Auditoría Requeridos:
            id_usuario: currentUserId, 
            usuarioregistro: currentUserId, 
            fecha_compra: localTime, // Usamos la marca de tiempo local para esta referencia
            
            // Campos de auditoría de Base de Datos (usando serverTimestamp para precisión en Firestore)
            fecha_creacion: serverTimestamp(), 
            fechamodificaion: serverTimestamp(),
            usuariomodifica: currentUserId,
        };

        // 2. 🔑 Guardar en Firebase (Asíncrono, se ejecuta en segundo plano)
        savePurchaseToFirestore(purchaseRecord);
        
        // 3. Guardar el ticket en el historial local (para la vista 'tickets')
        setTicketsGuardados((prevTickets) => [purchaseRecord, ...prevTickets]);

        // 4. Guardar el ticket en el estado temporal para mostrar el PDF de éxito
        setLastTicket(purchaseRecord); 

        // 5. Limpiar el carrito y cambiar la vista
        limpiarCarrito();
        setVista("compra-exitosa"); 
        
        mostrarNotificacion("Compra finalizada. Descarga tu ticket.", 'exito');
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

        {/* Vista COMPRA EXITOSA (Muestra el botón de Descarga del PDF) */}
        {vista === "compra-exitosa" && lastTicket && (
            <section className="compra-exitosa">
                <h1>¡Compra Finalizada con Éxito! 🎉</h1>
                <p>
                    Tu pedido ha sido procesado. Puedes descargar tu recibo de compra en
                    formato **PDF** para imprimirlo o guardarlo.
                </p>

                <div className="pdf-container" style={{ margin: '20px 0', padding: '15px', border: '1px solid #ccc', borderRadius: '8px', textAlign: 'center' }}>
                    {/* 👈 Aquí se usa el componente TicketPDF con el último ticket */}
                    <TicketPDF ticket={lastTicket} /> 
                </div>
                
                <p style={{ marginTop: '10px', fontSize: '14px', color: '#555' }}>
                    También puedes encontrar este y todos tus tickets en la sección **Tickets** del menú lateral.
                </p>
                <button 
                    className="boton-volver-compra" 
                    onClick={volverAInicio} 
                    style={{ marginTop: '20px' }}
                >
                    ← Volver a la Tienda
                </button>
            </section>
        )}

        {/* 🧾 Vista TICKETS - Ahora con el componente PDF */}
        {vista === "tickets" && (
          <section>
            <h1>Mis Tickets 🧾</h1>
            {ticketsGuardados.length === 0 ? (
                <p>Aún no tienes tickets de compra guardados.</p>
            ) : (
                <table>
                  <thead>
                    <tr>
                      <th>ID Local</th>
                      <th>Total</th>
                      <th>Método</th>
                      <th>Descarga</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ticketsGuardados.map((ticket, index) => (
                      <tr key={index}>
                        <td>#{ticket.id}</td>
                        <td>${ticket.total}</td>
                        <td>{ticket.formaPago}</td>
                        <td>
                            {/* Usamos TicketPDF como un botón de descarga */}
                            <TicketPDF ticket={ticket} buttonText="Descargar" /> 
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            )}
          </section>
        )}

        {/* Vista TIENDA FÍSICA - SIN CAMBIOS */}
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

        {/* 🆕 Vista CARRITO DE COMPRAS - Se pasa la prop de Firestore */}
        {vista === "carrito" && (
          <Carrito
            carrito={carrito}
            eliminarDelCarrito={eliminarDelCarrito}
            volverACompra={volverACompra}
            calcularTotal={calcularTotal}
            formaPago={formaPago}
            setFormaPago={setFormaPago}
            mostrarNotificacion={mostrarNotificacion}
            // 🔑 Propiedad para guardar el ticket en estados y Firestore
            guardarTicketYLimpiarCarrito={guardarTicketYLimpiarCarrito} 
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