// Ruta: src/components/organisms/CrearMetodoPago.jsx

// Se importa React y el hook useState para manejar el estado del formulario
import React, { useState } from "react";

// Funciones del backend para crear o editar métodos de pago
import {
  crearMetodoPago,
  editarMetodoPago,
} from "../../services/metodosPago";

// Componente reutilizable de input de texto
import InputText from "../atoms/InputText";

// Botón reutilizable del sistema
import { ButtonAction } from "../atoms/ButtonAction";

/**
 * Componente CrearMetodoPago
 *
 * Este componente se usa para:
 *  - Crear un método de pago nuevo.
 *  - Editar un método de pago existente.
 *
 * El comportamiento depende de la prop "modo":
 *   modo === "crear" → formulario vacío
 *   modo === "editar" → formulario con los datos existentes
 *
 * Props:
 *  - modo: "crear" o "editar"
 *  - metodo: objeto con datos del método (solo en modo edición)
 *  - onCerrar: función para cerrar el modal al terminar
 */
export default function CrearMetodoPago({ modo, metodo, onCerrar }) {
  /**
   * Estado del formulario
   *
   * Campos:
   *  - nombre: nombre del método de pago
   *  - activo: si está disponible o no
   *
   * Si estamos editando, se cargan los valores del método recibido.
   */
  const [form, setForm] = useState({
    nombre: metodo?.nombre || "",
    activo: metodo?.activo ?? true,
  });

  // Errores de validación
  const [errores, setErrores] = useState({});

  /**
   * handleChange
   *
   * Actualiza los valores del formulario cada vez que el usuario modifica un campo.
   * También borra el error del campo editado.
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
   *  - nombre: obligatorio, máximo 50 caracteres
   *  - activo: debe ser true o false, no null/undefined
   *
   * Devuelve true si todo está correcto, false si hay errores.
   */
  const validar = () => {
    const err = {};
    let ok = true;

    // Validación del nombre
    if (!form.nombre || form.nombre.trim().length === 0) {
      err.nombre = "El nombre no puede estar en blanco";
      ok = false;
    }

    if (form.nombre.trim().length > 50) {
      err.nombre = "Máximo 50 caracteres";
      ok = false;
    }

    // Validación del campo activo
    if (form.activo === null || form.activo === undefined) {
      err.activo = "El campo activo es obligatorio";
      ok = false;
    }

    setErrores(err);
    return ok;
  };

  /**
   * handleSubmit
   *
   * Se ejecuta cuando el usuario envía el formulario.
   * Valida los datos y luego:
   *  - crea un método de pago
   *  - o edita uno existente
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validar()) return;

    const payload = {
      nombre: form.nombre.trim(),
      activo: !!form.activo,
    };

    try {
      if (modo === "crear") {
        await crearMetodoPago(payload);
        alert("Método de pago creado con éxito!");
      } else {
        await editarMetodoPago(metodo.id, payload);
        alert("Método de pago editado correctamente!");
      }

      onCerrar(); // Cierra el modal
    } catch (err) {
      alert(err.message); // Error del backend
    }
  };

  /**
   * Render del modal con el formulario.
   * Incluye:
   *  - Campo nombre
   *  - Checkbox activo
   *  - Botones Guardar y Volver
   */
  return (
    <div className="modal-bg">
      <div className="modal-content">
        {/* Título dinámico */}
        <h2>{modo === "crear" ? "Crear Método de Pago" : "Editar Método de Pago"}</h2>

        <form onSubmit={handleSubmit}>
          {/* Campo Nombre */}
          <InputText
            label="Nombre"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            error={errores.nombre}
          />

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
          {errores.activo && (
            <p className="error-msg">{errores.activo}</p>
          )}

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