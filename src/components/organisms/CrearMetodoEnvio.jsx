// Ruta: src/components/organisms/CrearMetodoEnvio.jsx

// Se importa React y useState para manejar estados internos del formulario
import React, { useState } from "react";

// Funciones del backend para crear o editar métodos de envío
import { crearMetodoEnvio, editarMetodoEnvio } from "../../services/metodosEnvio";

// Input reutilizable de texto
import InputText from "../atoms/InputText";

// Botón reutilizable
import { ButtonAction } from "../atoms/ButtonAction";

/**
 * Componente CrearMetodoEnvio
 *
 * Este componente sirve para:
 *  - Crear un nuevo método de envío.
 *  - Editar un método de envío existente.
 *
 * El comportamiento depende de la prop "modo":
 *   - modo === "crear": el formulario comienza vacío.
 *   - modo === "editar": el formulario carga los datos del método enviado.
 *
 * Props:
 *  - modo: "crear" o "editar"
 *  - metodo: objeto con los datos existentes (solo en edición)
 *  - onCerrar: función para cerrar el modal al finalizar la acción
 */
export default function CrearMetodoEnvio({ modo, metodo, onCerrar }) {
  /**
   * Estado principal del formulario.
   * Guarda:
   *  - nombre
   *  - descripción
   *  - activo (checkbox)
   *
   * Si es edición, se inicializa con los valores existentes.
   */
  const [form, setForm] = useState({
    nombre: metodo?.nombre || "",
    descripcion: metodo?.descripcion || "",
    activo: metodo?.activo ?? true,
  });

  // Errores de validación por campo
  const [errores, setErrores] = useState({});

  /**
   * handleChange
   *
   * Actualiza el campo editado.
   * Limpia el error anterior del mismo campo.
   */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrores((prev) => ({ ...prev, [name]: "" }));
  };

  /**
   * validar
   *
   * Reglas:
   *  - nombre es obligatorio y máximo 80 caracteres.
   *  - descripción opcional, máximo 255 caracteres.
   *
   * Devuelve true si todo es válido, false si hay errores.
   */
  const validar = () => {
    const err = {};
    let ok = true;

    // Validación del nombre
    if (!form.nombre || form.nombre.trim().length === 0) {
      err.nombre = "El nombre no puede estar en blanco";
      ok = false;
    }

    if (form.nombre.trim().length > 80) {
      err.nombre = "Máximo 80 caracteres";
      ok = false;
    }

    // Validación de descripción
    if (form.descripcion && form.descripcion.length > 255) {
      err.descripcion = "Máximo 255 caracteres";
      ok = false;
    }

    setErrores(err);
    return ok;
  };

  /**
   * handleSubmit
   *
   * Se ejecuta al enviar el formulario.
   * Valida, construye el payload y llama al backend.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validar()) return;

    const payload = {
      nombre: form.nombre.trim(),
      descripcion: form.descripcion?.trim() || null,
      activo: !!form.activo,
    };

    try {
      if (modo === "crear") {
        await crearMetodoEnvio(payload);
        alert("Método de envío creado con éxito!");
      } else {
        await editarMetodoEnvio(metodo.id, payload);
        alert("Método de envío editado correctamente!");
      }

      onCerrar(); // Cierra el modal al terminar
    } catch (err) {
      alert(err.message);
    }
  };

  /**
   * Render del formulario dentro del modal.
   * Incluye:
   *  - título dinámico
   *  - campos nombre, descripción y activo
   *  - botones Guardar y Volver
   */
  return (
    <div className="modal-bg">
      <div className="modal-content">
        <h2>{modo === "crear" ? "Crear Método de Envío" : "Editar Método de Envío"}</h2>

        <form onSubmit={handleSubmit}>
          {/* Campo Nombre */}
          <InputText
            label="Nombre"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            error={errores.nombre}
          />

          {/* Campo Descripción */}
          <label htmlFor="descripcion">Descripción</label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
          />
          {errores.descripcion && (
            <p className="error-msg">{errores.descripcion}</p>
          )}

          {/* Checkbox Activo */}
          <label>
            <input
              type="checkbox"
              name="activo"
              checked={form.activo}
              onChange={handleChange}
            />
            Activo
          </label>

          {/* Botones del modal */}
          <div className="modal-buttons">
            <ButtonAction text="Guardar" type="submit" />
            <ButtonAction text="Volver" type="button" onClick={onCerrar} />
          </div>
        </form>
      </div>
    </div>
  );
}