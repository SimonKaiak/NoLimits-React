// Importamos React y useState para manejar el estado del formulario
import React, { useState } from "react";

// Importamos la función que llama al backend para crear una venta
import { crearVenta } from "../../services/ventas";

/**
 * Componente CrearVenta
 *
 * Permite crear una nueva venta ingresando:
 *  - ID del usuario que compra
 *  - ID del método de pago
 *  - ID del método de envío
 *  - ID del estado de la venta
 *
 * Props:
 *  - onFinish: función opcional que se ejecuta cuando la venta se crea correctamente
 */
export default function CrearVenta({ onFinish }) {

  /**
   * form:
   * Estado que almacena los valores escritos en los inputs.
   * Cada propiedad representa un campo necesario para crear la venta.
   */
  const [form, setForm] = useState({
    usuarioId: "",
    metodoPagoId: "",
    metodoEnvioId: "",
    estadoId: ""
  });

  /**
   * handleChange
   *
   * Se ejecuta cada vez que el usuario escribe en un input.
   * Actualiza el estado usando el nombre del input como clave.
   */
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  /**
   * handleSubmit
   *
   * - Evita que el formulario recargue la página
   * - Construye el "payload", que es el formato exacto que espera el backend
   * - Convierte los valores en números (porque son IDs)
   * - Llama al servicio crearVenta
   * - Ejecuta onFinish si existe
   */
  async function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      usuarioModel: { id: Number(form.usuarioId) },
      metodoPagoModel: { id: Number(form.metodoPagoId) },
      metodoEnvioModel: { id: Number(form.metodoEnvioId) },
      estado: { id: Number(form.estadoId) }
    };

    try {
      await crearVenta(payload);
      onFinish && onFinish();     // Ejecuta onFinish solo si fue enviado desde el padre
      alert("Venta creada correctamente");
    } catch (err) {
      alert("Error: " + err.message);
    }
  }

  /**
   * Render del formulario.
   * Contiene cuatro campos para ingresar IDs necesarios para crear la venta.
   */
  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <h3>Crear Venta</h3>

      <input
        name="usuarioId"
        placeholder="ID Usuario"
        onChange={handleChange}
        required
      />

      <input
        name="metodoPagoId"
        placeholder="ID Método Pago"
        onChange={handleChange}
        required
      />

      <input
        name="metodoEnvioId"
        placeholder="ID Método Envío"
        onChange={handleChange}
        required
      />

      <input
        name="estadoId"
        placeholder="ID Estado"
        onChange={handleChange}
        required
      />

      <button className="admin-btn">Guardar venta</button>
    </form>
  );
}
