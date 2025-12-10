// Ruta: src/components/organisms/CrearDesarrollador.jsx

// Se importa React y useState para manejar estados internos del componente
import React, { useState } from "react";

// Se importan las funciones del backend para crear o editar un tipo de desarrollador
import {
  crearDesarrollador,
  editarDesarrollador
} from "../../services/desarrolladores";

// Input de texto reutilizable
import InputText from "../atoms/InputText";

// Botón reutilizable
import { ButtonAction } from "../atoms/ButtonAction";

/**
 * Componente CrearDesarrollador
 *
 * Este componente cumple dos funciones:
 *  - Crear un nuevo tipo de desarrollador.
 *  - Editar un tipo de desarrollador existente.
 *
 * Props:
 *  - modo: "crear" o "editar"
 *  - desarrollador: datos existentes cuando se edita
 *  - onCerrar: función que cierra el modal
 */
export default function CrearDesarrollador({ modo, desarrollador, onCerrar }) {
  const [form, setForm] = useState({
    nombre: desarrollador?.nombre || "",
    activo: desarrollador?.activo ?? true,
  });

  const [errores, setErrores] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrores((prev) => ({ ...prev, [name]: "" }));
  };

  const validar = () => {
    const err = {};
    let ok = true;

    if (!form.nombre || form.nombre.trim().length === 0) {
      err.nombre = "El nombre no puede estar en blanco";
      ok = false;
    }

    if (form.nombre.trim().length > 120) {
      err.nombre = "Máximo 120 caracteres";
      ok = false;
    }

    setErrores(err);
    return ok;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validar()) return;

    // OJO: si tu backend solo espera "nombre",
    // cambia esto a: const payload = { nombre: form.nombre.trim() };
    const payload = {
      nombre: form.nombre.trim(),
      activo: !!form.activo,
    };

    try {
      if (modo === "crear") {
        await crearDesarrollador(payload);
        alert("Desarrollador creado con éxito!");
      } else {
        await editarDesarrollador(desarrollador.id, payload);
        alert("Desarrollador editado correctamente!");
      }

      onCerrar();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="modal-bg">
      <div className="modal-content">
        <h2>
          {modo === "crear"
            ? "Crear Desarrollador"
            : "Editar Desarrollador"}
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Campo nombre */}
          <InputText
            label="Nombre"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            error={errores.nombre}
          />

          {/* Checkbox de activo */}
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