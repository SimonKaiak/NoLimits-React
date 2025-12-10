// Ruta: src/components/organisms/CrearPlataforma.jsx

// Se importa React y el hook useState para manejar estados dentro del componente
import React, { useState } from "react";

// Funciones del backend que permiten crear y editar plataformas
import { crearPlataforma, editarPlataforma } from "../../services/plataformas";

// Input reutilizable para texto
import InputText from "../atoms/InputText";

// Botón reutilizable
import { ButtonAction } from "../atoms/ButtonAction";

/**
 * Componente CrearPlataforma
 *
 * Se usa para:
 *  - Crear una nueva plataforma
 *  - Editar una plataforma existente
 *
 * El comportamiento depende de "modo":
 *   modo === "crear" → formulario vacío
 *   modo === "editar" → formulario con los datos existentes
 *
 * Props:
 *  - modo: "crear" o "editar"
 *  - plataforma: objeto con datos (solo si se edita)
 *  - onCerrar: función para cerrar el modal / volver al listado al terminar
 */
export default function CrearPlataforma({ modo, plataforma, onCerrar }) {
  /**
   * Estado del formulario
   * Maneja solo un campo:
   *  - nombre: nombre de la plataforma
   *
   * Si está editando, se carga el nombre existente.
   */
  const [form, setForm] = useState({
    nombre: plataforma?.nombre || "",
  });

  // Errores de validación por campo
  const [errores, setErrores] = useState({});

  /**
   * handleChange
   *
   * Actualiza el valor del campo cuando el usuario escribe.
   * Limpia errores del mismo campo.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrores((prev) => ({ ...prev, [name]: "" }));
  };

  /**
   * validar
   *
   * Reglas de validación:
   *  - nombre obligatorio
   *  - máximo 80 caracteres
   *
   * Retorna true si no hay errores.
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
   * Valida los datos, arma el payload
   * y envía la solicitud al backend.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validar()) return;

    const payload = {
      nombre: form.nombre.trim(),
    };

    try {
      if (modo === "crear") {
        await crearPlataforma(payload);
        alert("Plataforma creada!");
      } else {
        await editarPlataforma(plataforma.id, payload);
        alert("Plataforma editada!");
      }

      onCerrar(); // Cierra el modal / vuelve al listado
    } catch (err) {
      alert(err.message);
    }
  };

  /**
   * Render del modal
   *
   * Muestra:
   *  - título según el modo
   *  - input nombre
   *  - botones Guardar y Volver
   */
  return (
    <div className="modal-bg">
      <div className="modal-content">
        <h2>{modo === "crear" ? "Crear Plataforma" : "Editar Plataforma"}</h2>

        <form onSubmit={handleSubmit}>
          {/* Campo Nombre */}
          <InputText
            label="Nombre"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            error={errores.nombre}
          />

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