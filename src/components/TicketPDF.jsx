// src/components/TicketPDF.jsx
import React from 'react';
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';

// Crea los estilos del PDF
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        padding: 30,
        fontFamily: 'Helvetica',
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1,
        borderBottom: '1pt solid #ccc',
    },
    header: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center',
        color: '#4a148c',
        fontWeight: 'bold',
    },
    subHeader: {
        fontSize: 12,
        marginBottom: 5,
        color: '#666',
    },
    productoItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        fontSize: 10,
        marginBottom: 5,
        paddingBottom: 2,
        borderBottom: '0.5pt dashed #eee',
    },
    totalContainer: {
        marginTop: 20,
        paddingTop: 10,
        borderTop: '1pt solid #4a148c',
        textAlign: 'right',
    },
    totalText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#d32f2f',
    },
    footer: {
        marginTop: 30,
        fontSize: 9,
        textAlign: 'center',
        color: '#aaa',
    }
});

// Componente que define el contenido del PDF
const TicketPDFDocument = ({ ticket }) => (
    <Document>
        <Page size="A6" style={styles.page}>
            <View style={styles.section}>
                <Text style={styles.header}>Recibo de Compra - Jewelry ✨</Text>
                
                <Text style={styles.subHeader}>ID Transacción: {ticket.id}</Text>
                <Text style={styles.subHeader}>Fecha: {new Date(ticket.fecha).toLocaleString()}</Text>
                <Text style={styles.subHeader}>Forma de Pago: {ticket.formaPago}</Text>
                
                <View style={{ marginTop: 15 }}>
                    <Text style={{ fontSize: 11, marginBottom: 10, fontWeight: 'bold' }}>PRODUCTOS:</Text>
                    
                    {ticket.productos.map((p, index) => (
                        <View key={index} style={styles.productoItem}>
                            <Text style={{ width: '70%' }}>{p.nombre}</Text>
                            <Text style={{ width: '30%', textAlign: 'right' }}>${p.precio}</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.totalContainer}>
                    <Text style={styles.totalText}>TOTAL: ${ticket.total}</Text>
                </View>
                
                <Text style={styles.footer}>
                    ¡Gracias por tu compra! Este recibo es la prueba de tu apartado.
                </Text>
            </View>
        </Page>
    </Document>
);

// Componente contenedor que usa PDFDownloadLink
const TicketPDF = ({ ticket }) => {
    // Genera un nombre de archivo único
    const fileName = `Ticket_${ticket.id}_${new Date(ticket.fecha).getTime()}.pdf`;

    return (
        <PDFDownloadLink 
            document={<TicketPDFDocument ticket={ticket} />} 
            fileName={fileName}
            // Agregamos una clase para que el botón pueda ser estilizado
            className="boton-descarga-pdf" 
        >
            {({ loading }) => 
                loading ? 'Generando PDF...' : '⬇️ Descargar Ticket PDF'
            }
        </PDFDownloadLink>
    );
};

export default TicketPDF;