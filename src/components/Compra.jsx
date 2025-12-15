// ConfirmacionModal.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// 🖼️ Importaciones de imágenes (Asegúrate de tener estos archivos en la ruta '../assets/')
import aretesorolaminado1 from "../assets/aretesrorolaminado1.png";
import anillodeplata1 from "../assets/anillodeplata1.png";
import collar1 from "../assets/collar1.png";
import pulcera1 from "../assets/pulcera1.png";
import arosplateados1 from "../assets/arosplateados1.png";
import collaroro from "../assets/collaroro.png"
import areteespiral from "../assets/areteespiral.png"
import aretedecorazon from "../assets/aretedecorazon.png"
import anillooro from "../assets/anillooro.png"
import anilloflor from "../assets/anilloflor.png"
import oropulsera from "../assets/oropulsera.png"
import platapulsera from "../assets/platapulsera.png"
import pulsera from "../assets/pulsera.png"
import pulseracorazon from "../assets/pulseracorazon.png"
import pulseraflor from "../assets/pulseraflor.png"
import pulseraoro from "../assets/pulseraoro.png"
import pulseraoroflor from "../assets/pulseraoroflor.png"
import pulseraplatarosa from "../assets/pulseraplatarosa.png"
import pulserarosa from "../assets/pulserarosa.png"
import pulserazul from "../assets/pulserazul.png"
import pulseraplata from "../assets/pulseraplata.png"
import collar2 from "../assets/collar2.png"
import collar3 from "../assets/collar3.png"
import collar4 from "../assets/collar4.png"
import collar5 from "../assets/collar5.png"
import collar6 from "../assets/collar6.png"
import collar7 from "../assets/collar7.png"
import collar8 from "../assets/collar8.png"
import collar9 from "../assets/collar9.png"
import collar10 from "../assets/collar10.png"
import collar11 from "../assets/collar11.png"
import collar12 from "../assets/collar12.png"
import collar13 from "../assets/collar13.png"
import anillo2 from "../assets/anillo2.png"
import anillo3 from "../assets/anillo3.png"
import anillo4 from "../assets/anillo4.png"
import anillo5 from "../assets/anillo5.png"
import anillo6 from "../assets/anillo6.png"
import anillo7 from "../assets/anillo7.png"
import anillo8 from "../assets/anillo8.png"
import aretes3 from "../assets/aretes3.png"
import aretes4 from "../assets/aretes4.png"
import aretes5 from "../assets/aretes5.png"
import aretes6 from "../assets/aretes6.png"
import aretes7 from "../assets/aretes7.png"
import aretes8 from "../assets/aretes8.png"
import aretes9 from "../assets/aretes9.png"


import "../style/Compra.css"; // ⚠️ Asegúrate de que tu archivo CSS exista

// 🆕 Importación del Logo
import Logo from "../assets/Logo.png";

// 🔐 Importaciones de Firebase Auth
import { getAuth, signOut } from "firebase/auth";

// 📦 Importaciones de Componentes (Asegúrate de que existan)
import Carrito from "./Carrito";
import TicketPDF from "./TicketPDF";
import ActualizarCuenta from "./ActualizarCuenta";
// ✨ NUEVA IMPORTACIÓN DEL MODAL DE CONFIRMACIÓN
import ConfirmacionModal from "./ConfirmacionModal"; 

// 🆕 IMPORTACIONES DE FIREBASE FIRESTORE
import { db, serverTimestamp } from "../firebase"; // ⚠️ Asegúrate de tener './firebase'
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

// --- Data Estática de Productos ---
const productosData = [
  {
    id: 1,
    nombre: "Aros oro laminado",
    categoria: "Aretes",
    material: "Oro Laminado",
    precio: 10,
    imagen: aretesorolaminado1,
    descuento: true,
  },
  {
    id: 2,
    nombre: "Anillo de plata con estrella, zafiro azul",
    categoria: "Anillos",
    material: "Plata",
    precio: 25,
    imagen: anillodeplata1,
    descuento: false,
  },
  {
    id: 3,
    nombre: "Collar elegante",
    categoria: "Collares",
    material: "Acero",
    precio: 30,
    imagen: collar1,
    descuento: true,
  },
  {
    id: 4,
    nombre: "Pulsera de acero",
    categoria: "Pulseras",
    material: "Acero",
    precio: 20,
    imagen: pulcera1,
    descuento: false,
  },
  {
    id: 5,
    nombre: "Aros de plata",
    categoria: "Aretes",
    material: "Plata",
    precio: 15,
    imagen: arosplateados1,
    descuento: true,
  },
{
    id: 6,
    nombre: "Collar de oro",
    categoria: "Collares",
    material: "Oro Laminado",
    precio: 20,
    imagen: collaroro,
    descuento: false,
  },
   
{
    id: 7,
    nombre: "Aretes",
    categoria: "Aretes",
    material: "Oro Laminado",
    precio: 15,
    imagen: aretes9,
    descuento: false,
  },
{
    id: 8,
    nombre: "Arete espiral",
    categoria: "Aretes",
    material: "Oro Laminado",
    precio: 10,
    imagen: areteespiral,
    descuento: true,
  },
{
    id: 9,
    nombre: "Aretes de corzon",
    categoria: "Aretes",
    material: "Oro Laminado",
    precio: 20,
    imagen: aretedecorazon,
    descuento: false,
  },
{
    id: 10,
    nombre: "Anillo oro",
    categoria: "Anillos",
    material: "Oro",
    precio: 20,
    imagen: anillooro,
    descuento: false,
  },
  {
    id: 11,
    nombre: "Anillo flor",
    categoria: "Anillos",
    material: "Oro",
    precio: 10,
    imagen: anilloflor,
    descuento: true,
  },
{
    id: 12,
    nombre: "Pulsera de oro",
    categoria: "Pulseras",
    material: "Oro",
    precio: 10,
    imagen: oropulsera,
    descuento: true,
  },
{
    id: 13,
    nombre: "Pulsera de plata",
    categoria: "Pulseras",
    material: "Plata",
    precio: 10,
    imagen: platapulsera,
    descuento: true,
  },
{
    id: 14,
    nombre: "Pulsera",
    categoria: "Pulseras",
    material: "Oro",
    precio: 10,
    imagen: pulsera,
    descuento: true,
  },
{
    id: 15,
    nombre: "Pulsera de corazon",
    categoria: "Pulseras",
    material: "Oro",
    precio: 17,
    imagen: pulseracorazon,
    descuento: false,
  },
{
    id: 16,
    nombre: "Pulsera azul",
    categoria: "Pulseras",
    material: "Plata",
    precio: 17,
    imagen: pulseraflor,
    descuento: false,
  },
{
    id: 17,
    nombre: "Pulsera de oro",
    categoria: "Pulseras",
    material: "Oro",
    precio: 15,
    imagen: pulseraoro,
    descuento: false,
  },
{
    id: 18,
    nombre: "Pulsera de flor de oro",
    categoria: "Pulseras",
    material: "Oro",
    precio: 10,
    imagen: pulseraoroflor,
    descuento: true,
  },
{
    id: 19,
    nombre: "Pulsera rosa",
    categoria: "Pulseras",
    material: "Oro",
    precio: 15,
    imagen: pulserarosa,
    descuento: false,
  },
{
    id: 20,
    nombre: "Pulsera de plata con rosa",
    categoria: "Pulseras",
    material: "Plata",
    precio: 27,
    imagen: pulseraplatarosa,
    descuento: false,
  },
{
    id: 21,
    nombre: "Pulsera con flores azules",
    categoria: "Pulseras",
    material: "Plata",
    precio: 18,
    imagen: pulserazul,
    descuento: false,
  },
{
id: 22,
    nombre: "Pulsera de plata de trebol",
    categoria: "Pulseras",
    material: "Plata",
    precio: 17,
    imagen: pulseraplata,
    descuento: false,
  },
{
    id: 23,
    nombre: "Collar plata con una perla",
    categoria: "Collares",
    material: "Plata",
    precio: 10,
    imagen: collar2,
    descuento: true,
  },
{
    id: 24,
    nombre: "Collar con dije de corazon de plata",
    categoria: "Collares",
    material: "Plata",
    precio: 15,
    imagen: collar3,
    descuento: true,
  },
{
    id: 25,
    nombre: "Collar de plata con dije",
    categoria: "Collares",
    material: "Plata",
    precio: 20,
    imagen: collar5,
    descuento: false,
  },
{
    id: 26,
    nombre: "Collar de corazon de plata",
    categoria: "Collares",
    material: "Plata",
    precio: 19,
    imagen: collar6,
    descuento: false,
  },
{
    id: 27,
    nombre: "Collar de oro con dos corazones",
    categoria: "Collares",
    material: "Oro",
    precio: 18,
    imagen: collar4,
    descuento: false,
  },
{
    id: 28,
    nombre: "Collar de oro elegante",
    categoria: "Collares",
    material: "Oro",
    precio: 30,
    imagen: collar7,
    descuento: false,
  },
{
    id: 29,
    nombre: "Collar de plata con dije elegante",
    categoria: "Collares",
    material: "Plata",
    precio: 19,
    imagen: collar8,
    descuento: false,
  },
{
    id: 30,
    nombre: "Collar de oro con dije circular",
    categoria: "Collares",
    material: "Oro",
    precio: 18,
    imagen: collar9,
    descuento: false,
  },
{
    id: 31,
    nombre: "Collar de corazon ",
    categoria: "Collares",
    material: "Plata",
    precio: 17,
    imagen: collar10,
    descuento: false,
  },
{
    id: 32,
    nombre: "Collar con dije elegante de oro",
    categoria: "Collares",
    material: "Oro",
    precio: 18,
    imagen: collar11,
    descuento: true,
  },
{
    id: 33,
    nombre: "Collar cisne negro de oro",
    categoria: "Collares",
    material: "Oro",
    precio: 25,
    imagen: collar12,
    descuento: false,
  },
{
    id: 34,
    nombre: "Collar con dije morado",
    categoria: "Collares",
    material: "Plata",
    precio: 18,
    imagen: collar13,
    descuento: true,
  },
{
    id: 35,
    nombre: "Anillo con de plata con diamante",
    categoria: "Anillos",
    material: "Plata",
    precio: 18,
    imagen: anillo2,
    descuento: false,
  },

{
    id: 36,
    nombre: "Anillo de plata",
    categoria: "Anillos",
    material: "Plata",
    precio: 15,
    imagen: anillo3,
    descuento: true,
  },
{
    id: 37,
    nombre: "Anillo de plata con diamantes ",
    categoria: "Anillos",
    material: "Plata",
    precio: 25,
    imagen: anillo4,
    descuento: false,
  },
{
    id: 38,
    nombre: "Anillo de oro con diamante de corazon",
    categoria: "Anillos",
    material: "Oro",
    precio: 13,
    imagen: anillo5,
    descuento: true,
  },
{
    id: 39,
    nombre: "Anillo de plata con diseño elegante",
    categoria: "Anillos",
    material: "Plata",
    precio: 35,
    imagen: anillo6,
    descuento: false,
  },
{
    id: 40,
    nombre: "Anillo de oro con forma de corazon",
    categoria: "Anillos",
    material: "Oro",
    precio: 17,
    imagen: anillo7,
    descuento: true,
  },
{
    id: 41,
    nombre: "Anillo de diamante",
    categoria: "Anillos",
    material: "Plata",
    precio: 18,
    imagen: anillo8,
    descuento: false,
  },
{
    id: 42,
    nombre: "Aretes de diamante azul",
    categoria: "Aretes",
    material: "Plata",
    precio: 19,
    imagen: aretes3,
    descuento: false,
  },
{
    id: 43,
    nombre: "Aretes de oro circulares",
    categoria: "Aretes",
    material: "Oro",
    precio: 18,
    imagen: aretes4,
    descuento: false,
  },
{
    id: 44,
    nombre: "Aretes de plata circulares en espiral",
    categoria: "Aretes",
    material: "Plata",
    precio: 15,
    imagen: aretes5,
    descuento: true,
  },
{
    id: 45,
    nombre: "Aretes de diamante rosa",
    categoria: "Aretes",
    material: "Plata",
    precio: 17,
    imagen: aretes6,
    descuento: false,
  },
{
    id: 46,
    nombre: "Aretes de diamante",
    categoria: "Aretes",
    material: "Plata",
    precio: 16,
    imagen: aretes7,
    descuento: false,
  },
{
    id: 47,
    nombre: "Aretes de oro en forma de flor",
    categoria: "Aretes",
    material: "Oro",
    precio: 20,
    imagen: aretes8,
    descuento: true,
  },

];


const Compra = ({ mostrarNotificacion }) => {
  const navigate = useNavigate();

  // --- Estados de la Aplicación ---
  const [vista, setVista] = useState("inicio");
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todo");
  const [busqueda, setBusqueda] = useState("");
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [carrito, setCarrito] = useState([]);
  const [formaPago, setFormaPago] = useState("Efectivo");
  const [ticketsGuardados, setTicketsGuardados] = useState([]);
  const [lastTicket, setLastTicket] = useState(null);
  const [loadingTickets, setLoadingTickets] = useState(true);

  // ✨ ESTADO PARA EL MODAL DE CONFIRMACIÓN DE DESACTIVACIÓN
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false); 

  // --- Info de Usuario ---
  const auth = getAuth();
  const currentUser = auth.currentUser;
  // Se usa el UID si está logeado, si no, un placeholder.
  const currentUserId = currentUser ? currentUser.uid : "Anonimo_Desconectado";

  // ----------------------------------------------------
  // 🔑 FUNCIÓN PARA CARGAR LA COMPRA DESDE FIRESTORE
  // ----------------------------------------------------
  const loadPurchasesFromFirestore = async () => {
    if (!currentUser) {
      console.log("Usuario no autenticado, no se cargan tickets.");
      setTicketsGuardados([]);
      setLoadingTickets(false);
      return;
    }

    try {
      setLoadingTickets(true);
      const comprasCollection = collection(db, "compras");

      // FILTRO: Solo trae los tickets de este usuario
      const q = query(
        comprasCollection,
        where("id_usuario", "==", currentUserId)
      );

      const querySnapshot = await getDocs(q);
      const loadedTickets = [];

      querySnapshot.forEach((doc) => {
        // Se guarda el ID del documento de Firestore
        loadedTickets.push({ ...doc.data(), id: doc.id });
      });

      // Actualizar el estado con los tickets cargados (nuevos primero)
      setTicketsGuardados(loadedTickets.reverse());
      // mostrarNotificacion(`Se cargaron ${loadedTickets.length} tickets de la DB.`, 'default');
    } catch (error) {
      console.error("Error al cargar los tickets de Firestore:", error);
      mostrarNotificacion("Error al cargar tus tickets de compra.", "error");
    } finally {
      setLoadingTickets(false);
    }
  };

  // ----------------------------------------------------
  // 💡 EFECTO: Carga los tickets al montar el componente (iniciar sesión)
  // ----------------------------------------------------
  useEffect(() => {
    // Se ejecuta la carga de datos del historial
    loadPurchasesFromFirestore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]); // Recarga si el estado de autenticación cambia

  // ----------------------------------------------------
  // 🔑 FUNCIÓN PARA GUARDAR LA COMPRA EN FIRESTORE
  // ----------------------------------------------------
  const savePurchaseToFirestore = async (purchaseRecord) => {
    try {
      const comprasCollection = collection(db, "compras");

      const docRef = await addDoc(comprasCollection, purchaseRecord);
      console.log("Compra guardada en Firestore con ID:", docRef.id);

      // Añadir el ID del documento al registro antes de guardarlo localmente
      const savedRecord = { ...purchaseRecord, id: docRef.id };

      // 3. Guardar el ticket en el historial local (ya con ID de DB)
      setTicketsGuardados((prevTickets) => [savedRecord, ...prevTickets]);

      // 4. Guardar el ticket en el estado temporal para mostrar el PDF de éxito
      setLastTicket(savedRecord);

      mostrarNotificacion(
        `Ticket guardado en DB con ID: ${docRef.id.substring(0, 4)}...`,
        "default"
      );
    } catch (error) {
      console.error("Error al guardar la compra en Firestore:", error);
      mostrarNotificacion(
        "Error al guardar el ticket en la base de datos.",
        "error"
      );
    }
  };

  // --- Funciones de Sesión y Cuenta ---

  const cerrarSesion = async () => {
    await signOut(auth);
    // Al cerrar sesión, también limpiamos los tickets locales
    setTicketsGuardados([]);
    mostrarNotificacion("Sesión cerrada correctamente", "default");
    navigate("/");
  };

  // 1. FUNCIÓN: Lógica para abrir el modal de Desactivación de cuenta
  const desactivarCuenta = () => {
    const usuario = auth.currentUser;

    if (!usuario) {
      mostrarNotificacion("No hay usuario conectado para desactivar.", "error");
      return;
    }
    // Abre el modal de confirmación, la lógica real está en confirmarDesactivacion
    setMostrarConfirmacion(true); 
  };

  // 2. FUNCIÓN: Lógica real que se ejecuta al confirmar (pasada como prop al Modal)
  const confirmarDesactivacion = async () => {
    setMostrarConfirmacion(false); // Cerramos el modal primero
    const usuario = auth.currentUser;
    if (!usuario) return; 

    try {
      const userDocRef = doc(db, "usuarios", usuario.uid);

      await updateDoc(userDocRef, {
        activo: false,
        fecha_desactivacion: serverTimestamp(),
      });

      await signOut(auth);

      mostrarNotificacion(
        "Cuenta desactivada correctamente y sesión cerrada. Ya no podrás acceder.",
        "default"
      );
      navigate("/");
    } catch (error) {
      console.error("Error al desactivar la cuenta en Firestore:", error);
      mostrarNotificacion(
        `Error al desactivar cuenta: ${error.message}`,
        "error"
      );
    }
  };

  // 3. FUNCIÓN: Lógica para cancelar la acción (pasada como prop al Modal)
  const cancelarDesactivacion = () => {
    setMostrarConfirmacion(false); // Simplemente cerramos el modal
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
    mostrarNotificacion(`Se agregó "${producto.nombre}" al carrito!`, "exito");
    cerrarModalProducto();
  };

  const abrirCarrito = () => {
    setVista("carrito");
  };

  const eliminarDelCarrito = (indexParaEliminar) => {
    const nuevoCarrito = carrito.filter(
      (_, index) => index !== indexParaEliminar
    );
    setCarrito(nuevoCarrito);
    mostrarNotificacion(`Producto eliminado del carrito.`, "default");
  };

  const volverACompra = () => {
    if (carrito.length > 0) {
      mostrarNotificacion(
        "Tu carrito se ha guardado. Puedes volver a él desde el botón Carrito.",
        "default"
      );
    }
    setVista("inicio");
  };

  const calcularTotal = () => {
    return carrito
      .reduce((total, producto) => total + producto.precio, 0)
      .toFixed(2);
  };

  const limpiarCarrito = () => {
    setCarrito([]);
    setFormaPago("Efectivo");
  };

  const volverAInicio = () => {
    setLastTicket(null);
    setVista("inicio");
  };

  // ----------------------------------------------------
  // 🔑 FUNCIÓN PRINCIPAL DE FINALIZACIÓN DE COMPRA
  // ----------------------------------------------------
  const guardarTicketYLimpiarCarrito = (ticket) => {
    const localTime = new Date().toISOString();

    // 1. Crear el objeto completo del ticket con campos de auditoría
    const purchaseRecord = {
      ...ticket,

      // 💡 Campos de Auditoría Requeridos:
      id_usuario: currentUserId,
      usuarioregistro: currentUserId,
      fecha_compra: localTime,

      // Campos de auditoría de Base de Datos
      fecha_creacion: serverTimestamp(),
      fechamodificaion: serverTimestamp(),
      usuariomodifica: currentUserId,
    };

    // 2. 🔑 Guardar en Firebase (Asíncrono). Esto ahora maneja el setTicketsGuardados y setLastTicket
    savePurchaseToFirestore(purchaseRecord);

    // 5. Limpiar el carrito y cambiar la vista
    limpiarCarrito();
    setVista("compra-exitosa");

    mostrarNotificacion("Compra finalizada. Descarga tu ticket.", "exito");
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
        {/* INICIO: Logo en el menú lateral */}
        <div className="logo-aside">
          <img src={Logo} alt="Logo de Jewelry" className="logo-menu-lateral" />
        </div>
        {/* FIN: Logo en el menú lateral */}

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
          {/* ⬅️ 2. BOTÓN PARA ACTUALIZAR CUENTA */}
          <button
            className={vista === "actualizar" ? "activo" : ""}
            onClick={() => setVista("actualizar")}
          >
             Actualizar Cuenta
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
          {/* 🚨 Este botón AHORA abre el modal de confirmación */}
          <button className="eliminar" onClick={desactivarCuenta}>
            Desactivar cuenta
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
              Tu pedido ha sido procesado. Puedes descargar tu recibo de compra
              en formato **PDF** para imprimirlo o guardarlo.
            </p>

            <div
              className="pdf-container"
              style={{
                margin: "20px 0",
                padding: "15px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                textAlign: "center",
              }}
            >
              {/* Componente TicketPDF para generar/descargar el ticket final */}
              <TicketPDF ticket={lastTicket} />
            </div>

            <p
              style={{ marginTop: "10px", fontSize: "14px", color: "#555" }}
            >
              También puedes encontrar este y todos tus tickets en la sección{" "}
              **Tickets** del menú lateral.
            </p>
            <button
              className="boton-volver-compra"
              onClick={volverAInicio}
              style={{ marginTop: "20px" }}
            >
              ← Volver a la Tienda
            </button>
          </section>
        )}

        {/* 🧾 Vista TICKETS - Ahora con carga de Firebase */}
        {vista === "tickets" && (
          <section>
            <h1>Mis Tickets 🧾</h1>
            {loadingTickets ? (
              <p>Cargando tus tickets...</p>
            ) : ticketsGuardados.length === 0 ? (
              <p>Aún no tienes tickets de compra guardados.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>ID de Ticket</th>
                    <th>Total</th>
                    <th>Método</th>
                    <th>Descarga</th>
                  </tr>
                </thead>
                <tbody>
                  {ticketsGuardados.map((ticket) => (
                    // Usamos el ID del ticket de Firestore para la key
                    <tr key={ticket.id}>
                      <td>#{ticket.id.substring(0, 6)}...</td>
                      <td>${ticket.total}</td>
                      <td>{ticket.formaPago}</td>
                      <td>
                        <TicketPDF ticket={ticket} buttonText="Descargar" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        )}

        {/* 🆕 3. VISTA ACTUALIZAR CUENTA */}
        {vista === "actualizar" && (
          <ActualizarCuenta
            mostrarNotificacion={mostrarNotificacion}
            setVista={setVista} // Para que pueda volver a 'inicio'
          />
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
      <button className="boton-carrito" onClick={abrirCarrito}>
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

      {/* 🚨 MODAL DE CONFIRMACIÓN DE DESACTIVACIÓN DE CUENTA */}
      <ConfirmacionModal
        abierto={mostrarConfirmacion}
        titulo="⚠️ Desactivar Cuenta"
        mensaje="¿Seguro que deseas desactivar tu cuenta? Esto la marcará como inactiva en el sistema y se cerrará tu sesión permanentemente. **Esta acción no se puede deshacer fácilmente.**"
        textoConfirmar="Sí, Desactivar"
        textoCancelar="No, Cancelar"
        onConfirmar={confirmarDesactivacion} // Ejecuta la lógica de Firebase
        onCancelar={cancelarDesactivacion}   // Cierra el modal
      />
    </div>
  );
};

export default Compra;