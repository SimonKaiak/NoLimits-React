// Ruta: src/components/organisms/CrearGenero.jsx

// Se importa React y el hook useState para manejar estados internos del componente
import React, { useState } from "react";

// Funciones del backend para crear o editar géneros
import { crearGenero, editarGenero } from "../../services/generos";

// Componente de input reutilizable para texto
import InputText from "../atoms/InputText";

// Botón reutilizable para acciones dentro del modal
import { ButtonAction } from "../atoms/ButtonAction";

/**
 * Componente CrearGenero
 *
 * Este formulario se usa para:
 *  - Crear un género nuevo
 *  - Editar un género existente
 *
 * El comportamiento depende de la prop "modo":
 *    modo === "crear"  → crea un género nuevo
 *    modo === "editar" → edita el género recibido en props
 *
 * Props:
 *  - modo: "crear" o "editar"
 *  - genero: objeto con datos (se usa solo en edición)
 *  - onCerrar: función para cerrar el modal cuando se termina
 */
export default function CrearGenero({ modo, genero, onCerrar }) {
  /**
   * Estado del formulario
   *
   * Solo maneja un campo:
   *  - nombre
   *
   * Si está editando, carga el nombre existente.
   */
  const [form, setForm] = useState({
    nombre: genero?.nombre || "",
  });

  // Estado que almacena errores de validación
  const [errores, setErrores] = useState({});

  /**
   * handleChange
   *
   * Se ejecuta cuando el usuario escribe.
   * Actualiza el valor del nombre y limpia errores anteriores.
   */
  const handleChange = (e) => {
    setForm({ nombre: e.target.value });
    setErrores({});
  };

  /**
   * validar
   *
   * Reglas:
   *  - El nombre es obligatorio.
   *  - Máximo 80 caracteres permitidos.
   *
   * Retorna true si todo es válido.
   * Retorna false si hay errores.
   */
  const validar = () => {
    const err = {};
    let ok = true;

    if (!form.nombre || form.nombre.trim().length === 0) {
      err.nombre = "El nombre no puede estar en blanco";
      ok = false;
    }

    if (form.nombre.trim().length > 80) {
      err.nombre = "Máximo 80 caracteres";
      ok = false;
    }

    setErrores(err);
    return ok;
  };

  /**
   * handleSubmit
   *
   * Se ejecuta al enviar el formulario.
   * Valida los datos, crea el payload y envía la solicitud al backend.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validar()) return;

    const payload = {
      nombre: form.nombre.trim(),
    };

    try {
      if (modo === "crear") {
        // Crea un género nuevo
        await crearGenero(payload);
        alert("Género creado con éxito!");
      } else {
        // Edita el género existente
        await editarGenero(genero.id, payload);
        alert("Género editado correctamente!");
      }

      onCerrar(); // Cierra el modal al finalizar (vuelve al listado)
    } catch (err) {
      alert(err.message);
    }
  };

  /**
   * Render del formulario dentro del modal
   */
  return (
    <div className="modal-bg">
      <div className="modal-content">
        {/* Título dinámico */}
        <h2>{modo === "crear" ? "Crear Género" : "Editar Género"}</h2>

        <form onSubmit={handleSubmit}>
          {/* Campo Nombre */}
          <InputText
            label="Nombre"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            error={errores.nombre}
          />

          {/* Botones Guardar / Volver */}
          <div className="modal-buttons">
            <ButtonAction text="Guardar" type="submit" />
            <ButtonAction text="Volver" type="button" onClick={onCerrar} />
          </div>
        </form>
      </div>
    </div>
  );
}