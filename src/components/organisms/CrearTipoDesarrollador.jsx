// Ruta: src/components/organisms/CrearTipoDesarrollador.jsx

// Importa React y el hook useState para manejar valores del formulario
import React, { useState } from "react";

// Botón reutilizable del sistema
import { ButtonAction } from "../atoms/ButtonAction.jsx";

// Funciones del backend para crear y actualizar tipos de desarrollador
import {
  crearTipoDesarrollador,
  actualizarTipoDesarrollador,
} from "../../services/tiposDesarrollador.js";

/**
 * Componente CrearTipoDesarrollador
 *
 * Este formulario permite:
 *  - Crear un nuevo tipo de desarrollador (por ejemplo: Estudio, Publisher, Freelancer)
 *  - Editar un tipo de desarrollador existente
 *
 * Props:
 *  - modo: "crear" o "editar"
 *  - tipo: datos existentes cuando estamos editando
 *  - onCerrar: función para cerrar el modal cuando finaliza el proceso
 */
export default function CrearTipoDesarrollador({ modo, tipo, onCerrar }) {
  /**
   * Estado que guarda solo un campo:
   *  - nombre: nombre del tipo de desarrollador
   *
   * Si estamos editando, carga el nombre desde "tipo".
   */
  const [nombre, setNombre] = useState(tipo?.nombre || "");

  // Variable que ayuda a decidir si estamos en modo edición
  const esEditar = modo === "editar";

  /**
   * handleSubmit
   *
   * Se ejecuta cuando el usuario envía el formulario.
   * Valida que el nombre no esté vacío,
   * arma el payload y llama al backend.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = { nombre: nombre.trim() };

    // Validación simple
    if (!payload.nombre) {
      alert("El nombre es obligatorio");
      return;
    }

    try {
      // Si estamos editando, actualizamos el registro
      if (esEditar && tipo?.id) {
        await actualizarTipoDesarrollador(tipo.id, payload);
        alert("Tipo de desarrollador actualizado");
      } else {
        // Si no, creamos uno nuevo
        await crearTipoDesarrollador(payload);
        alert("Tipo de desarrollador creado");
      }

      // Cierra el modal al finalizar
      onCerrar();
    } catch (err) {
      console.error(err);
      alert("Error al guardar el tipo de desarrollador");
    }
  };

  /**
   * Render del modal con el formulario.
   *
   * Muestra:
   *  - Título dinámico según si se crea o edita
   *  - Input para el nombre
   *  - Botones Guardar y Volver
   */
  return (
    <div className="admin-modal-backdrop">
      <div className="admin-modal">
        <h2 className="admin-title">
          Gestionar Tipo de Desarrollador
        </h2>

        <form className="admin-form" onSubmit={handleSubmit}>
          {/* Campo nombre */}
          <label className="admin-label">
            Nombre
            <input
              type="text"
              className="admin-input"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Estudio, Publisher, Freelancer..."
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