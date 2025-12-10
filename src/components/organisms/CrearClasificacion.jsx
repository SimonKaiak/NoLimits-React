import React, { useState } from "react";
import { crearClasificacion, editarClasificacion } from "../../services/clasificaciones";
import InputText from "../atoms/InputText";
import { ButtonAction } from "../atoms/ButtonAction";

export default function CrearClasificacion({ modo, clasificacion, onCerrar }) {
  const [form, setForm] = useState({
    nombre: clasificacion?.nombre || "",
    descripcion: clasificacion?.descripcion || "",
    activo: clasificacion?.activo ?? true,
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

    if (form.nombre.trim().length > 50) {
      err.nombre = "Máximo 50 caracteres";
      ok = false;
    }

    if (form.descripcion && form.descripcion.length > 255) {
      err.descripcion = "La descripción no puede superar los 255 caracteres";
      ok = false;
    }

    setErrores(err);
    return ok;
  };

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
        await crearClasificacion(payload);
        alert("Clasificación creada con éxito!");
      } else {
        await editarClasificacion(clasificacion.id, payload);
        alert("Clasificación editada correctamente!");
      }

      onCerrar();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="modal-bg">
      <div className="modal-content">
        <h2>{modo === "crear" ? "Crear Clasificación" : "Editar Clasificación"}</h2>

        <form onSubmit={handleSubmit}>
          <InputText
            label="Nombre"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            error={errores.nombre}
          />

          <label>Descripción</label>
          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
          />
          {errores.descripcion && (
            <p className="error-msg">{errores.descripcion}</p>
          )}

          <label>
            <input
              type="checkbox"
              name="activo"
              checked={form.activo}
              onChange={handleChange}
            />
            Activo
          </label>

          <div className="modal-buttons">
            <ButtonAction text="Guardar" type="submit" />
            <ButtonAction text="Volver" type="button" onClick={onCerrar} />
          </div>
        </form>
      </div>
    </div>
  );
}