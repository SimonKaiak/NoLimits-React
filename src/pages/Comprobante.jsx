// Ruta: src/pages/Comprobante.jsx
/**
 * Página de Comprobante de Pago
 *
 * - Muestra los datos de la compra exitosa
 * - Permite descargar el comprobante en PDF
 * - Limpia el carrito y envía al usuario al catálogo
 */

import React, { useEffect, useState } from "react";
import { ButtonAction } from "../components/atoms/ButtonAction";
import { useNavigate } from "react-router-dom";
import html2pdf from "html2pdf.js";
import "../styles/detalleCompra.css";

export const Comprobante = () => {
  const navigate = useNavigate();

  /** Datos de la compra */
  const [compra, setCompra] = useState(null);

  /** Usuario autenticado */
  const [usuario, setUsuario] = useState(null);

  /**
   * Limpia carrito / total / compra (si corresponde)
   * Luego redirige al catálogo
   */
  const handleVolver = () => {
    localStorage.removeItem("carrito");
    localStorage.removeItem("totalCompra");
    // Si NO quieres que el comprobante se mantenga en “Volver”, también puedes:
    // localStorage.removeItem("compra");
    navigate("/principal");
  };

  /**
   * Carga los datos del localStorage al montar el componente
   */
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("compra"));
    if (data) setCompra(data);

    const userData = JSON.parse(localStorage.getItem("nl_user"));
    if (userData) setUsuario(userData);
  }, []);

  /**
   * Si aún no carga la compra
   */
  if (!compra) {
    return (
      <div className="loading-overlay">
        <p className="cargando">Cargando comprobante...</p>
      </div>
    );
  }

  /**
   * Generar PDF con html2pdf.js
   */
  const handleDescargar = () => {
    const element = document.getElementById("zona-comprobante");
    if (!element) return;

    // Añade clase especial para PDF (si tienes estilos específicos)
    element.classList.add("pdf-mode");

    const opciones = {
      margin: 0.5,
      filename: `Comprobante_${compra.ventaId || compra.orden}.pdf`,
      image: { type: "jpeg", quality: 1 },
      html2canvas: {
        scale: 2,
        backgroundColor: null, // Mantiene tu fondo transparente u original
      },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    html2pdf()
      .set(opciones)
      .from(element)
      .save()
      .then(() => {
        // Volver a la vista normal
        element.classList.remove("pdf-mode");
      });
  };

  /**
   * Productos (maneja compras simples y múltiples)
   */
  const productos = Array.isArray(compra.productos) ? compra.productos : [];

  return (
    <div className="comprobante-page">
      <div className="comprobante-container-carrusel" id="zona-comprobante">
        
        {/* Mensaje principal */}
        <h2>¡Felicidades, el pago se ha realizado con éxito!</h2>
        <p>Gracias por confiar en NoLimits :)</p>

        {/* ===========================
            SECCIÓN DETALLE DEL PAGO
        ============================ */}
        <div className="detalle-section">
          <h3>Detalle del pago</h3>

          <p><strong>Comercio:</strong> NoLimits</p>

          {/* Productos */}
          <p><strong>Producto(s):</strong></p>

          {productos.length > 0 ? (
            <ul className="lista-productos-compra">
              {productos.map((p, idx) => (
                <li key={idx}>
                  {p.nombre} {p.cantidad ? `x${p.cantidad}` : ""}
                </li>
              ))}
            </ul>
          ) : (
            <p>{compra.productoNombre}</p>
          )}

          {/* Orden */}
          <p>
            <strong>Orden de pago:</strong>{" "}
            {compra.ventaId ? `#VENTA-${compra.ventaId}` : `#${compra.orden}`}
          </p>

          {/* Fecha */}
          <p><strong>Fecha:</strong> {compra.fecha}</p>

          {/* Correo usuario */}
          <p><strong>Correo:</strong> {usuario?.correo || "No disponible"}</p>

          {/* Monto */}
          <p>
            <strong>Monto:</strong>{" "}
            ${Number(compra.precio || 0).toLocaleString("es-CL")}
          </p>

        </div>

        {/* ===========================
            BOTONES
        ============================ */}
        <div className="botones-container">
          <ButtonAction
            text="Descargar comprobante"
            onClick={handleDescargar}
            className="btn-descargar-comprobante"
          />

          <ButtonAction
            text="Volver al inicio"
            onClick={handleVolver}
            className="btn-volver-inicio"
          />
        </div>
      </div>
    </div>
  );
};
