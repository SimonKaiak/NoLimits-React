// Ruta: src/components/organisms/CrearEmpresa.jsx

// Se importa React y el hook useState para manejar estados internos
import React, { useState } from "react";

// Funciones del backend para crear y editar empresas
import { crearEmpresa, editarEmpresa } from "../../services/empresas";

// Input de texto reutilizable
import InputText from "../atoms/InputText";

// Botón del sistema reutilizable para acciones
import { ButtonAction } from "../atoms/ButtonAction";

/**
 * Componente CrearEmpresa
 *
 * Este formulario permite:
 *  - Crear una nueva empresa
 *  - Editar una empresa existente
 *
 * El comportamiento depende de la prop "modo":
 *    modo === "crear"  -> crea una empresa nueva
 *    modo === "editar" -> edita la empresa enviada en la prop "empresa"
 *
 * Parámetros:
 *  - modo: "crear" o "editar"
 *  - empresa: objeto con datos (solo cuando se edita)
 *  - onCerrar: función para cerrar el modal cuando se finaliza la acción
 */
export default function CrearEmpresa({ modo, empresa, onCerrar }) {
  /**
   * Estado del formulario
   *
   * Se inicializa con:
   *  - valores vacíos si se está creando
   *  - valores existentes si se está editando
   */
  const [form, setForm] = useState({
    nombre: empresa?.nombre || "",
    activo: empresa?.activo ?? true,
  });

  // Estado que guarda los mensajes de error para cada campo
  const [errores, setErrores] = useState({});

  /**
   * handleChange
   *
   * Se ejecuta cuando el usuario escribe en un input o cambia un checkbox.
   * Actualiza el formulario y limpia cualquier error anterior del mismo campo.
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
   *  - El nombre es obligatorio.
   *  - Máximo 120 caracteres permitidos.
   *
   * Si hay errores, se guardan en "errores" y se retorna false.
   * Si todo está bien, retorna true.
   */
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

  /**
   * handleSubmit
   *
   * Se ejecuta cuando se envía el formulario.
   * Valida los datos y luego:
   *  - llama a crearEmpresa si el modo es "crear"
   *  - llama a editarEmpresa si el modo es "editar"
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
        await crearEmpresa(payload);
        alert("Empresa creada con éxito!");
      } else {
        await editarEmpresa(empresa.id, payload);
        alert("Empresa editada correctamente!");
      }

      // Cierra el modal cuando termina
      onCerrar();
    } catch (err) {
      alert(err.message);
    }
  };

  /**
   * Render del modal
   *
   * Muestra:
   *  - título según el modo
   *  - campo nombre
   *  - checkbox de activo
   *  - botones Guardar y Volver
   */
  return (
    <div className="modal-bg">
      <div className="modal-content">
        <h2>{modo === "crear" ? "Crear Empresa" : "Editar Empresa"}</h2>

        <form onSubmit={handleSubmit}>
          {/* Campo Nombre */}
          <InputText
            label="Nombre"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            error={errores.nombre}
          />

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

          {/* Botones de acción */}
          <div className="modal-buttons">
            <ButtonAction text="Guardar" type="submit" />
            <ButtonAction text="Volver" type="button" onClick={onCerrar} />
          </div>
        </form>
      </div>
    </div>
  );
}