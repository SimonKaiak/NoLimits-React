// Ruta: src/components/organisms/CrearProducto.jsx
import React, { useEffect, useState } from "react";

// Servicios del recurso Producto (crear / editar)
import { crearProducto, editarProducto } from "../../services/productos";

// Servicios de catálogos (desde el mismo productos.js)
import {
  obtenerTiposProducto,
  obtenerClasificaciones,
  obtenerEstadosProducto as obtenerEstados,
  obtenerPlataformas,
  obtenerGeneros,
  obtenerEmpresas,
  obtenerDesarrolladores,
} from "../../services/productos";

const INITIAL_FORM = {
  nombre: "",
  precio: "",
  tipoProductoId: "",
  clasificacionId: "",
  estadoId: "",
  saga: "",
  portadaSaga: "",
  // campos para listas (se guardan como texto "1,2,3")
  plataformasIds: "",
  generosIds: "",
  empresasIds: "",
  desarrolladoresIds: "",
  imagenes: "",
};

export default function CrearProducto({
  modo = "crear",
  productoInicial = null,
  onFinish,
  onCancel,                  // ✅ nuevo prop para cancelar (solo edición)
}) {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [error, setError] = useState("");

  // Catálogos
  const [tipos, setTipos] = useState([]);
  const [clasificaciones, setClasificaciones] = useState([]);
  const [estados, setEstados] = useState([]);

  const [plataformas, setPlataformas] = useState([]);
  const [generos, setGeneros] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [desarrolladores, setDesarrolladores] = useState([]);

  // Cargar catálogos al iniciar
  useEffect(() => {
    async function cargar() {
      try {
        const [
          tiposData,
          clasifData,
          estadosData,
          plataformasData,
          generosData,
          empresasData,
          desarrolladoresData,
        ] = await Promise.all([
          obtenerTiposProducto(),
          obtenerClasificaciones(),
          obtenerEstados(),
          obtenerPlataformas(),
          obtenerGeneros(),
          obtenerEmpresas(),
          obtenerDesarrolladores(),
        ]);

        setTipos(tiposData);
        setClasificaciones(clasifData);
        setEstados(estadosData);

        setPlataformas(plataformasData);
        setGeneros(generosData);
        setEmpresas(empresasData);
        setDesarrolladores(desarrolladoresData);
      } catch (e) {
        console.error("Error cargando catálogos:", e);
      }
    }
    cargar();
  }, []);

  // Cargar datos si se edita
  useEffect(() => {
    if (productoInicial) {
      setFormData({
        ...INITIAL_FORM,
        nombre: productoInicial.nombre ?? "",
        precio: productoInicial.precio ?? "",
        tipoProductoId: productoInicial.tipoProductoId ?? "",
        clasificacionId: productoInicial.clasificacionId ?? "",
        estadoId: productoInicial.estadoId ?? "",
        saga: productoInicial.saga ?? "",
        portadaSaga: productoInicial.portadaSaga ?? "",
      });
    } else {
      setFormData(INITIAL_FORM);
    }
  }, [productoInicial]);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const parseIds = (value) =>
    value
      .split(",")
      .map((v) => Number(v.trim()))
      .filter((n) => !Number.isNaN(n));

  const parseStrings = (value) =>
    value
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const payload = {
      nombre: formData.nombre,
      precio: Number(formData.precio),
      tipoProductoId: Number(formData.tipoProductoId),
      clasificacionId: formData.clasificacionId
        ? Number(formData.clasificacionId)
        : null,
      estadoId: Number(formData.estadoId),
      saga: formData.saga || null,
      portadaSaga: formData.portadaSaga || null,
    };

    // Solo mandamos listas si el usuario seleccionó algo
    if (formData.plataformasIds.trim() !== "") {
      payload.plataformasIds = parseIds(formData.plataformasIds);
    }
    if (formData.generosIds.trim() !== "") {
      payload.generosIds = parseIds(formData.generosIds);
    }
    if (formData.empresasIds.trim() !== "") {
      payload.empresasIds = parseIds(formData.empresasIds);
    }
    if (formData.desarrolladoresIds.trim() !== "") {
      payload.desarrolladoresIds = parseIds(formData.desarrolladoresIds);
    }
    if (formData.imagenes.trim() !== "") {
      payload.imagenes = parseStrings(formData.imagenes);
    }

    try {
      let result;
      if (modo === "editar" && productoInicial?.id) {
        result = await editarProducto(productoInicial.id, payload);
      } else {
        result = await crearProducto(payload);
      }

      if (modo === "crear") {
        setFormData(INITIAL_FORM);
      }

      if (onFinish) onFinish(result || null);
    } catch (err) {
      console.error(err);
      setError("Error al guardar: " + err.message);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>{modo === "editar" ? "Editar producto" : "Crear producto"}</h3>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Nombre */}
      <input
        type="text"
        name="nombre"
        placeholder="Nombre"
        value={formData.nombre}
        onChange={handleChange}
        required
      />

      {/* Precio */}
      <input
        type="number"
        name="precio"
        placeholder="Precio"
        value={formData.precio}
        onChange={handleChange}
        required
      />

      {/* Tipo de producto */}
      <select
        name="tipoProductoId"
        value={formData.tipoProductoId}
        onChange={handleChange}
        required
      >
        <option value="">Seleccione tipo de producto</option>
        {tipos.map((t) => (
          <option key={t.id} value={t.id}>
            {t.nombre}
          </option>
        ))}
      </select>

      {/* Clasificación */}
      <select
        name="clasificacionId"
        value={formData.clasificacionId}
        onChange={handleChange}
      >
        <option value="">Sin clasificación</option>
        {clasificaciones.map((c) => (
          <option key={c.id} value={c.id}>
            {c.nombre}
          </option>
        ))}
      </select>

      {/* Estado */}
      <select
        name="estadoId"
        value={formData.estadoId}
        onChange={handleChange}
        required
      >
        <option value="">Seleccione estado</option>
        {estados.map((e) => (
          <option key={e.id} value={e.id}>
            {e.nombre}
          </option>
        ))}
      </select>

      {/* Saga */}
      <input
        type="text"
        name="saga"
        placeholder="Saga (opcional)"
        value={formData.saga}
        onChange={handleChange}
      />

      {/* Portada Saga */}
      <input
        type="text"
        name="portadaSaga"
        placeholder="URL portada saga (opcional)"
        value={formData.portadaSaga}
        onChange={handleChange}
      />

      {/* Plataformas */}
      <select
        name="plataformasIds"
        value={formData.plataformasIds}
        onChange={handleChange}
      >
        <option value="">Sin plataforma</option>
        {plataformas.map((p) => (
          <option key={p.id} value={p.id}>
            {p.nombre}
          </option>
        ))}
      </select>

      {/* Géneros */}
      <select
        name="generosIds"
        value={formData.generosIds}
        onChange={handleChange}
      >
        <option value="">Sin género</option>
        {generos.map((g) => (
          <option key={g.id} value={g.id}>
            {g.nombre}
          </option>
        ))}
      </select>

      {/* Empresas */}
      <select
        name="empresasIds"
        value={formData.empresasIds}
        onChange={handleChange}
      >
        <option value="">Sin empresa</option>
        {empresas.map((emp) => (
          <option key={emp.id} value={emp.id}>
            {emp.nombre}
          </option>
        ))}
      </select>

      {/* Desarrolladores */}
      <select
        name="desarrolladoresIds"
        value={formData.desarrolladoresIds}
        onChange={handleChange}
      >
        <option value="">Sin desarrollador</option>
        {desarrolladores.map((d) => (
          <option key={d.id} value={d.id}>
            {d.nombre}
          </option>
        ))}
      </select>

      {/* Imágenes */}
      <input
        type="text"
        name="imagenes"
        placeholder="URLs de imágenes separadas por coma"
        value={formData.imagenes}
        onChange={handleChange}
      />

      {/* Fila de botones: cancelar izquierda, guardar derecha */}
      <div className="admin-products-actions-row">
        {modo === "editar" && onCancel && (
          <button
            type="button"
            className="btn-nl btn-nl-secondary admin-products-btn-cancel"
            onClick={onCancel}
          >
            Cancelar edición
          </button>
        )}

        <button
          type="submit"
          className={
            modo === "editar"
              ? "btn-nl btn-nl-secondary admin-products-btn-cancel" // mismo estilo
              : "btn-nl btn-nl-secondary"
          }
        >
          {modo === "editar" ? "Guardar" : "Guardar"}
        </button>
      </div>
    </form>
  );
}