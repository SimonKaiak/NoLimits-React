// Importa React y el hook useState para manejar el estado del input
import React, { useState } from "react";

// Botón reutilizable del sistema
import { ButtonAction } from "../atoms/ButtonAction.jsx";

// Funciones del backend para crear y actualizar tipos de empresa
import {
  crearTipoEmpresa,
  actualizarTipoEmpresa,
} from "../../services/tiposEmpresa.js";

/**
 * Componente CrearTipoEmpresa
 *
 * Este formulario permite:
 *  - Crear un nuevo tipo de empresa (por ejemplo: Publisher, Distribuidor, etc.)
 *  - Editar un tipo de empresa existente
 *
 * Props:
 *  - modo: "crear" o "editar"
 *  - tipo: datos del tipo de empresa cuando se está editando
 *  - onCerrar: función que cierra el modal al finalizar el proceso
 */
export default function CrearTipoEmpresa({ modo, tipo, onCerrar }) {
  /**
   * Estado del campo "nombre".
   * Si se está editando, carga el nombre existente.
   */
  const [nombre, setNombre] = useState(tipo?.nombre || "");

  // Ayuda a saber rápidamente si estamos en modo edición
  const esEditar = modo === "editar";

  /**
   * handleSubmit
   *
   * Se ejecuta al enviar el formulario.
   * 1. Valida que haya un nombre.
   * 2. Construye el payload.
   * 3. Llama a la función correspondiente del backend
   *    (crear o actualizar).
   * 4. Cierra el modal al finalizar.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = { nombre: nombre.trim() };

    // Validación básica
    if (!payload.nombre) {
      alert("El nombre es obligatorio");
      return;
    }

    try {
      if (esEditar && tipo?.id) {
        // Actualiza un tipo ya existente
        await actualizarTipoEmpresa(tipo.id, payload);
        alert("Tipo de empresa actualizado");
      } else {
        // Crea uno nuevo
        await crearTipoEmpresa(payload);
        alert("Tipo de empresa creado");
      }

      // Cierra el modal
      onCerrar();
    } catch (err) {
      console.error(err);
      alert("Error al guardar el tipo de empresa");
    }
  };

  /**
   * Render del modal con el formulario.
   *
   * Contiene:
   *  - Un título dinámico según el modo
   *  - Un campo de texto para el nombre
   *  - Botones Guardar y Volver
   */
  return (
    <div className="admin-modal-backdrop">
      <div className="admin-modal">
        {/* Título dependiendo del modo */}
        <h2 className="admin-title">
          {esEditar ? "Editar Tipo de Empresa" : "Crear Tipo de Empresa"}
        </h2>

        {/* Formulario principal */}
        <form className="admin-form" onSubmit={handleSubmit}>
          {/* Campo nombre */}
          <label className="admin-label">
            Nombre
            <input
              type="text"
              className="admin-input"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Publisher"
            />
          </label>

          {/* Botones de acción */}
          <div className="admin-actions">
            <ButtonAction
              type="submit"
              text={esEditar ? "Guardar cambios" : "Crear"}
            />
            <ButtonAction
              type="button"
              text="Volver"
              onClick={onCerrar}
            />
          </div>
        </form>
      </div>
    </div>
  );
}