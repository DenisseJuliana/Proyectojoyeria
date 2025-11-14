import React, { useEffect } from 'react';
import '../style/Notificacion.css'; // Asegúrate de crear este archivo

const Notificacion = ({ mensaje, tipo, onClose }) => {
    // Si no hay mensaje, no renderizar nada
    if (!mensaje) {
        return null;
    }

    // Ocultar automáticamente después de 3 segundos
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000); 

        return () => clearTimeout(timer); // Limpieza
    }, [mensaje, onClose]); // Depende del mensaje para reiniciar el timer

    // Clase CSS para el tipo de notificación
    const claseTipo = tipo ? `notificacion-${tipo}` : 'notificacion-default';

    return (
        <div className="notificacion-container"> 
            <div className={`notificacion-toast ${claseTipo}`}>
                <p>
                    {tipo === 'exito' ? '✅' : 'ℹ️'} {mensaje}
                </p>
                <button className="cerrar-toast" onClick={onClose}>
                    &times;
                </button>
            </div>
        </div>
    );
};

export default Notificacion;