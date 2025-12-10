// Se importa React y useState para manejar estados dentro del componente
import React, { useState } from "react";

// Función del backend que crea un detalle de venta
import { crearDetalleVenta } from "../../services/ventas";

/**
 * Componente CrearDetalleVenta
 *
 * Permite agregar un producto dentro de una venta existente.
 * Se usa normalmente en paneles de administración donde el usuario
 * puede ir sumando productos a una venta ya registrada.
 *
 * Parámetros (props):
 *  - ventaId: ID de la venta a la que se agregará el detalle.
 *  - onFinish: función opcional que se ejecuta cuando el detalle se crea correctamente.
 */
export default function CrearDetalleVenta({ ventaId, onFinish }) {
  /**
   * Estado del formulario
   *
   * Guarda:
   *  - productoId: ID del producto que se agregará
   *  - cantidad: cantidad de unidades
   *  - precioUnitario: precio del producto en esa venta
   */
  const [form, setForm] = useState({
    productoId: "",
    cantidad: 1,
    precioUnitario: "",
  });

  /**
   * handleChange
   *
   * Se ejecuta cada vez que el usuario escribe en los inputs.
   * Actualiza el estado del formulario con los nuevos valores.
   */
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  /**
   * handleSubmit
   *
   * Se ejecuta cuando se envía el formulario.
   * Convierte los valores a número y arma el payload requerido por el backend.
   */
  async function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      // Relación a la venta: se envía solo su id
      venta: { id: ventaId },

      // Producto asociado: solo se envía su id convertido a número
      producto: { id: Number(form.productoId) },

      // Convertimos cantidad y precio a número
      cantidad: Number(form.cantidad),
      precioUnitario: Number(form.precioUnitario),
    };

    try {
      // Se envía la solicitud al backend
      await crearDetalleVenta(payload);

      // Si existe onFinish, se ejecuta (por ejemplo para cerrar un modal o refrescar la tabla)
      onFinish && onFinish();
    } catch (err) {
      alert("Error detalle: " + err.message);
    }
  }

  /**
   * Render del formulario
   *
   * Incluye campos simples para:
   *  - ID del producto
   *  - cantidad
   *  - precio unitario
   *
   * Y un botón para agregar el detalle.
   */
  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <h4>Agregar producto</h4>

      {/* Campo ID del producto */}
      <input
        name="productoId"
        placeholder="ID Producto"
        onChange={handleChange}
        required
      />

      {/* Campo cantidad */}
      <input
        name="cantidad"
        type="number"
        onChange={handleChange}
        required
      />

      {/* Campo precio unitario */}
      <input
        name="precioUnitario"
        type="number"
        onChange={handleChange}
        required
      />

      {/* Botón para agregar el detalle */}
      <button className="admin-btn">Agregar</button>
    </form>
  );
}
