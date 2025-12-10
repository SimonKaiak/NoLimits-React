import React, { useEffect, useState } from "react";
import "../../styles/detalleCompra.css";

/**
 * Componente DetallesCompra
 *
 * Muestra la información final de una compra:
 *  - El nombre del producto comprado
 *  - El precio pagado
 *  - La fecha de la compra
 *
 * Este componente además busca el nombre del producto dentro
 * del carrito guardado en localStorage.
 */
export const DetallesCompra = ({ precio, fecha }) => {

  /**
   * productoComprado:
   * Estado que guarda el nombre del producto que se mostrará.
   * Por defecto dice "No definido" hasta que encontremos el dato.
   */
  const [productoComprado, setProductoComprado] = useState("No definido");

  /**
   * useEffect:
   * Se ejecuta una vez cuando el componente aparece en pantalla.
   *
   * Toma el carrito guardado en localStorage (si existe)
   * y extrae el nombre del primer producto.
   */
  useEffect(() => {
    // Buscamos el carrito. Si no existe, devolvemos un arreglo vacío.
    const carrito = JSON.parse(localStorage.getItem("CART")) || [];

    if (carrito.length > 0) {
      /**
       * carrito[0] representa el primer producto del carrito.
       * Algunas veces el backend devuelve "nombre" y otras "titulo",
       * por eso revisamos ambas.
       *
       * Si ninguna existe, mostramos "Producto".
       */
      setProductoComprado(
        carrito[0].nombre || carrito[0].titulo || "Producto"
      );
    }
  }, []); // [] significa que esto solo se ejecuta una vez

  /**
   * Render del componente.
   * Muestra la información formateada.
   */
  return (
    <div className="detalles-compra">
      <h3>Detalles de la compra</h3>

      <p><strong>Producto:</strong> {productoComprado}</p>

      <p>
        <strong>Precio:</strong> ${Number(precio || 0).toLocaleString("es-CL")}
      </p>

      <p><strong>Fecha:</strong> {fecha}</p>
    </div>
  );
};
