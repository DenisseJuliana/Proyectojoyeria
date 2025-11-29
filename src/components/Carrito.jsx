import React from 'react';
// 1. Importación del Logo (usando la ruta relativa correcta)
import Logo from "../assets/Logo.png"; 
import "../style/Carrito.css";


// Este componente Carrito.jsx gestiona la visualización y las acciones
// del carrito, recibiendo todos los datos y funciones necesarios como props.
const Carrito = ({
    carrito,
    eliminarDelCarrito,
    volverACompra,
    calcularTotal,
    // Props existentes
    formaPago,
    setFormaPago,
    mostrarNotificacion,
    // Nueva prop para guardar el ticket y limpiar el carrito
    guardarTicketYLimpiarCarrito 
}) => {

    // Función para manejar la finalización de la compra
    const finalizarCompra = () => {
        if (carrito.length === 0) {
            mostrarNotificacion("No puedes finalizar la compra, el carrito está vacío.", 'error');
            return;
        }

        const totalCalculado = calcularTotal();
        // Genera un ID simple y corto para el ticket
        const ticketId = Math.random().toString(36).substring(2, 9).toUpperCase(); 

        // 1. Crear el objeto del ticket con toda la información
        const nuevoTicket = {
            id: ticketId, // 🆕 AGREGAR ID para el nombre del archivo y referencia
            fecha: new Date().toISOString(), // Usar ISO string para guardar fecha y hora exacta
            total: totalCalculado,
            formaPago: formaPago,
            productos: carrito.map(p => ({
                nombre: p.nombre,
                precio: p.precio,
                id: p.id,
            })),
        };

        // 2. Guardar el ticket en el historial y limpiar el carrito
        guardarTicketYLimpiarCarrito(nuevoTicket);
    };
    
    // ❌ La función imprimirTicket y su botón han sido eliminados de este archivo.

    return (
        <section className="seccion-carrito">
            {/* 2. Implementación del logo en el encabezado */}
            <div className="carrito-header">
                <img 
                    src={Logo} 
                    alt="Logo de Jewelry" 
                    className="carrito-logo" 
                />
                <h1>Mi Carrito de Compras 🛒</h1>
            </div>
            {/* FIN de Implementación del logo */}
            
            <button className="boton-volver-compra" onClick={volverACompra}>
                ← Volver a Compra
            </button>

            {carrito.length === 0 ? (
                <p>Tu carrito está vacío. ¡Empieza a explorar nuestras joyas!</p>
            ) : (
                <>
                    <ul className="lista-carrito">
                        {carrito.map((producto, index) => (
                            // Usamos el índice y el id para una clave única
                            <li key={`${producto.id}-${index}`} className="item-carrito">
                                <img
                                    src={producto.imagen}
                                    alt={producto.nombre}
                                    width={60}
                                    height={60}
                                    className="imagen-carrito"
                                />
                                <div className="info-carrito">
                                    <p>
                                        <strong>{producto.nombre}</strong>
                                        {producto.descuento && (
                                            <span className="tag-oferta"> (¡Oferta!)</span>
                                        )}
                                    </p>
                                    <p>
                                        <strong>Categoría:</strong> {producto.categoria} | <strong>Material:</strong> {producto.material}
                                    </p>
                                    <p>
                                        <strong>Precio:</strong> <strong>${producto.precio}</strong>
                                    </p>
                                </div>
                                <button
                                    className="boton-cancelar"
                                    onClick={() => eliminarDelCarrito(index)}
                                >
                                    ❌ Cancelar
                                </button>
                            </li>
                        ))}
                    </ul>

                    <div className="resumen-carrito">
                        <h3>Total a Pagar: <strong>${calcularTotal()}</strong></h3>

                        {/* Select para la Forma de Pago */}
                        <div className="forma-pago-container">
                            <label htmlFor="pago">Forma de Pago:</label>
                            <select
                                id="pago"
                                value={formaPago}
                                onChange={(e) => setFormaPago(e.target.value)}
                            >
                                <option value="Efectivo">Efectivo</option>
                                <option value="Tarjeta">Tarjeta</option>
                                <option value="Transferencia">Transferencia</option> 
                            </select>
                        </div>
                        
                        {/* ❌ BOTÓN DE ALERTA ELIMINADO */}

                        <button
                            className="boton-finalizar-compra"
                            onClick={finalizarCompra}
                        >
                            Pagar y Finalizar Compra
                        </button>
                    </div>
                </>
            )}

            
        </section>
    );
};

export default Carrito;