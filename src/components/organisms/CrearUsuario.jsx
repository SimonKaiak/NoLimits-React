// Ruta: src/components/organisms/CrearUsuario.jsx
import React, { useEffect, useState } from "react";
import { crearUsuario, editarUsuario } from "../../services/usuarios";
import { obtenerRegiones } from "../../services/regiones";
import { obtenerComunas } from "../../services/comunas";

export default function CrearUsuario({
  modo = "crear",
  usuarioInicial = null,
  onFinish,
  onCancel,
}) {
  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    correo: "",
    telefono: "",
    password: "",
    rolId: "",

    // Dirección
    calle: "",
    numero: "",
    complemento: "",
    codigoPostal: "",
    regionId: "",
    comunaId: "",
  });

  const [error, setError] = useState("");
  const [regiones, setRegiones] = useState([]);
  const [comunas, setComunas] = useState([]);
  const [comunasFiltradas, setComunasFiltradas] = useState([]);

  useEffect(() => {
    obtenerRegiones().then(setRegiones).catch(console.error);
    obtenerComunas().then(setComunas).catch(console.error);
  }, []);

  useEffect(() => {
    if (!formData.regionId) {
      setComunasFiltradas([]);
      return;
    }
    const filtradas = comunas.filter(
      (c) => Number(c.regionId) === Number(formData.regionId)
    );
    setComunasFiltradas(filtradas);
  }, [formData.regionId, comunas]);

  useEffect(() => {
    if (!usuarioInicial) return;

    setFormData({
      nombre: usuarioInicial.nombre ?? "",
      apellidos: usuarioInicial.apellidos ?? "",
      correo: usuarioInicial.correo ?? "",
      telefono: usuarioInicial.telefono ?? "",
      password: "",
      rolId: usuarioInicial.rolId ?? "",

      calle: usuarioInicial.direccion?.calle ?? "",
      numero: usuarioInicial.direccion?.numero ?? "",
      complemento: usuarioInicial.direccion?.complemento ?? "",
      codigoPostal: usuarioInicial.direccion?.codigoPostal ?? "",
      regionId: usuarioInicial.regionId ?? "",
      comunaId: usuarioInicial.comunaId ?? "",
    });
  }, [usuarioInicial]);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
      e.preventDefault();
      setError("");

      const payload = {
        nombre: formData.nombre,
        apellidos: formData.apellidos,
        correo: formData.correo,
        telefono: Number(formData.telefono),
        rolId: Number(formData.rolId),
      };

      // password solo si corresponde
      if (modo === "crear" || formData.password.trim() !== "") {
        payload.password = formData.password;
      }

      //  Dirección totalmente opcional: SOLO si viene algo "real"
      const tieneDireccion =
        (formData.comunaId && String(formData.comunaId).trim() !== "") ||
        (formData.calle && formData.calle.trim() !== "") ||
        (formData.numero && formData.numero.trim() !== "") ||
        (formData.complemento && formData.complemento.trim() !== "") ||
        (formData.codigoPostal && formData.codigoPostal.trim() !== "");

      if (tieneDireccion) {
        const comunaIdNum = formData.comunaId ? Number(formData.comunaId) : null;

        payload.direccion = {
          calle: formData.calle?.trim() || null,
          numero: formData.numero?.trim() || null,
          complemento: formData.complemento?.trim() || null,
          codigoPostal: formData.codigoPostal?.trim() || null,
          comunaId: comunaIdNum, // puede ser null si no vino
        };
      }

      try {
        if (modo === "editar" && usuarioInicial?.id) {
          await editarUsuario(usuarioInicial.id, payload);
        } else {
          await crearUsuario(payload);
        }
        if (onFinish) onFinish();
      } catch (err) {
        console.error(err);
        setError("Error al guardar usuario: " + err.message);
      }
    }

  return (
    <form className="admin-form admin-form-vertical" onSubmit={handleSubmit}>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="admin-form-row">
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="apellidos"
          placeholder="Apellidos"
          value={formData.apellidos}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="correo"
          placeholder="Correo"
          value={formData.correo}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="telefono"
          placeholder="Teléfono"
          value={formData.telefono}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder={
            modo === "crear"
              ? "Contraseña"
              : "Nueva contraseña (opcional)"
          }
          value={formData.password}
          onChange={handleChange}
          maxLength={10}
          required={modo === "crear"}
        />

        <input
          type="number"
          name="rolId"
          placeholder="ID rol"
          value={formData.rolId}
          onChange={handleChange}
          required
        />
      </div>

      {/* Bloque de botones abajo */}
      <div className="admin-form-actions">
        {modo === "editar" && onCancel && (
          <button
            type="button"
            className="admin-btn-secondary"
            onClick={onCancel}
          >
            ← Volver
          </button>
        )}

        <button type="submit" className="admin-btn">
          {modo === "editar" ? "Guardar cambios" : "Crear usuario"}
        </button>
      </div>
    </form>
  );
}