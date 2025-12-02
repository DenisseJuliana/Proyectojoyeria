// ConfirmacionModal.jsx
import React from 'react';

const ConfirmacionModal = ({ 
    abierto, 
    titulo, 
    mensaje, 
    onConfirmar, 
    onCancelar,
    textoConfirmar,
    textoCancelar
}) => {
    if (!abierto) return null;

    return (
        // Fondo oscuro que cubre toda la pantalla (overlay)
        <div style={styles.overlay}>
            {/* El cuerpo del modal o la "ventana" */}
            <div style={styles.modal}>
                <h3 style={styles.titulo}>{titulo}</h3>
                <p style={styles.mensaje}>{mensaje}</p>
                <div style={styles.acciones}>
                    {/* Botón de Cancelar */}
                    <button 
                        style={{...styles.boton, ...styles.botonCancelar}} 
                        onClick={onCancelar}
                    >
                        {textoCancelar}
                    </button>
                    {/* Botón de Confirmar (rojo para una acción destructiva) */}
                    <button 
                        style={{...styles.boton, ...styles.botonConfirmar}} 
                        onClick={onConfirmar}
                    >
                        {textoConfirmar}
                    </button>
                </div>
            </div>
        </div>
    );
};

// 🎨 Estilos básicos (¡Reemplaza con tus estilos reales/librería de UI!)
const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000, // Asegura que esté encima de todo
    },
    modal: {
        backgroundColor: '#fff',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        maxWidth: '400px',
        width: '90%',
        textAlign: 'center',
    },
    titulo: {
        color: '#333',
        marginBottom: '15px',
    },
    mensaje: {
        color: '#555',
        marginBottom: '25px',
        fontSize: '16px',
    },
    acciones: {
        display: 'flex',
        justifyContent: 'space-around',
    },
    boton: {
        padding: '10px 20px',
        borderRadius: '4px',
        border: 'none',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 'bold',
        transition: 'background-color 0.3s',
    },
    botonCancelar: {
        backgroundColor: '#ccc',
        color: '#333',
    },
    botonConfirmar: {
        backgroundColor: '#dc3545', // Rojo para acción destructiva
        color: '#fff',
    },
};

export default ConfirmacionModal;