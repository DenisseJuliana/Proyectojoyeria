import React from 'react';

// Este componente Carrito.jsx gestiona la visualización y las acciones
// del carrito, recibiendo todos los datos y funciones necesarios como props.
const Carrito = ({ 
    carrito, 
    eliminarDelCarrito, 
    volverACompra, 
    calcularTotal,
    // 🆕 Nuevas props recibidas de Compra.jsx
    formaPago,
    setFormaPago,
    mostrarNotificacion 
}) => {
    
    // Función para manejar la finalización de la compra
    const finalizarCompra = () => {
        if (carrito.length === 0) {
            // alert("No puedes finalizar la compra, el carrito está vacío."); // ❌ Reemplazado
            mostrarNotificacion("No puedes finalizar la compra, el carrito está vacío.", 'error'); // ✅
            return;
        }
        // alert(`Compra finalizada por $${calcularTotal()} con ${formaPago}. ¡Gracias!`); // ❌ Reemplazado
        mostrarNotificacion(`Compra finalizada por $${calcularTotal()} con ${formaPago}. ¡Gracias!`, 'exito'); // ✅
        
        // La lógica de limpieza del carrito debe estar en Compra.jsx,
        // o si no se limpia, al menos se vuelve a la vista de compra.
        volverACompra(); 
    };

    return (
        <section className="seccion-carrito">
            <h1>Mi Carrito de Compras 🛒</h1>
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
                                        **{producto.nombre}**
                                        {producto.descuento && (
                                            <span className="tag-oferta"> (¡Oferta!)</span>
                                        )}
                                    </p>
                                    <p>
                                        **Categoría:** {producto.categoria} | **Material:** {producto.material}
                                    </p>
                                    <p>
                                        **Precio:** **${producto.precio}**
                                    </p>
                                </div>
                                <button
                                    className="boton-cancelar"
                                    // 💡 eliminamos el id, solo pasamos el index como en Compra.jsx
                                    onClick={() => eliminarDelCarrito(index)} 
                                >
                                    ❌ Cancelar
                                </button>
                            </li>
                        ))}
                    </ul>

                    <div className="resumen-carrito">
                        <h3>Total a Pagar: **${calcularTotal()}**</h3>

                        <div className="forma-pago-container">
                            <label htmlFor="pago">Forma de Pago:</label>
                            <select 
                                id="pago" 
                                value={formaPago} 
                                // 💡 Usamos setFormaPago pasado por props
                                onChange={(e) => setFormaPago(e.target.value)}
                            >
                                <option value="Efectivo">Efectivo</option>
                                <option value="Tarjeta">Tarjeta</option>
                            </select>
                        </div>

                        <button 
                            className="boton-finalizar-compra"
                            onClick={finalizarCompra}
                        >
                            Pagar y Finalizar Compra
                        </button>
                    </div>
                </>
            )}
            
            <button className="boton-volver-compra" onClick={volverACompra}>
                ← Volver a Compra
            </button>
        </section>
    );
};

export default Carrito;