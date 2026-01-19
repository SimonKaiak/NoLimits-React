// Ruta: src/components/organisms/CrearEstado.jsx

// Se importa React y useState para manejar estados dentro del componente
import React, { useState } from "react";

// Funciones del backend para crear o editar un estado
import { crearEstado, editarEstado } from "../../services/estados";

// Input de texto reutilizable
import InputText from "../atoms/InputText";

// Botón reutilizable para acciones del modal
import { ButtonAction } from "../atoms/ButtonAction";

/**
 * Componente CrearEstado
 *
 * Este componente sirve tanto para:
 *  - Crear un nuevo estado
 *  - Editar un estado existente
 *
 * El comportamiento depende de la prop "modo":
 *    modo === "crear"  -> formulario vacío
 *    modo === "editar" -> carga datos del estado recibido en props
 *
 * Props:
 *  - modo: "crear" o "editar"
 *  - estado: datos existentes cuando se edita
 *  - onCerrar: función para cerrar el modal / volver al listado una vez finalizado
 */
export default function CrearEstado({ modo, estado, onCerrar }) {
  /**
   * Estado del formulario
   *
   * Guarda:
   *  - nombre
   *  - descripción
   *  - activo (checkbox)
   *
   * Si estamos editando, se inicializa con los datos recibidos.
   */
  const [form, setForm] = useState({
    nombre: estado?.nombre || "",
    descripcion: estado?.descripcion || "",
    activo: estado?.activo ?? true,
  });

  // Estado que almacena los errores de validación campo por campo
  const [errores, setErrores] = useState({});

  /**
   * handleChange
   *
   * Actualiza el formulario cada vez que el usuario escribe o cambia el checkbox.
   * Limpia errores previos del campo que se está editando.
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
   * Reglas de validación:
   *  - El nombre es obligatorio y no puede superar 50 caracteres.
   *  - La descripción es opcional, pero no puede superar 255 caracteres.
   *
   * Devuelve true si todo está correcto.
   * Devuelve false si hay errores.
   */
  const validar = () => {
    const err = {};
    let ok = true;

    if (!form.nombre || form.nombre.trim().length === 0) {
      err.nombre = "El nombre no puede estar en blanco";
      ok = false;
    }

    if (form.nombre.trim().length > 50) {
      err.nombre = "Máximo 50 caracteres";
      ok = false;
    }

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
   * Se ejecuta cuando se envía el formulario.
   * Valida los datos, construye el payload y envía la solicitud al backend.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validar()) return;

    const payload = {
      nombre: form.nombre.trim(),
      descripcion: (form.descripcion || "").trim(), 
      activo: Boolean(form.activo),
    };

    try {
      if (modo === "crear") {
        console.log("PAYLOAD ESTADO =>", payload);
        await crearEstado(payload);
        alert("Estado creado con éxito!");
      } else {
        await editarEstado(estado.id, payload);
        alert("Estado editado correctamente!");
      }

      onCerrar(); // Cierra el modal / vuelve al listado
    } catch (err) {
      alert(err.message);
    }
  };

  /**
   * Render del formulario dentro de un modal.
   *
   * Contiene:
   *  - Título según el modo
   *  - Input nombre
   *  - Textarea descripción
   *  - Checkbox activo
   *  - Botones Guardar y Volver
   */
  return (
    <div className="modal-bg">
      <div className="modal-content">
        <h2>{modo === "crear" ? "Crear Estado" : "Editar Estado"}</h2>

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

          {/* Campo Activo */}
          <label>
            <input
              type="checkbox"
              name="activo"
              checked={form.activo}
              onChange={handleChange}
            />
            Activo
          </label>

          {/* Botones */}
          <div className="modal-buttons">
            <ButtonAction text="Guardar" type="submit" />
            <ButtonAction text="Volver" type="button" onClick={onCerrar} />
          </div>
        </form>
      </div>
    </div>
  );
}