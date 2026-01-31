import React, { useEffect, useState, useRef } from "react";

// Servicios del recurso Producto (crear / editar)
import { crearProducto, editarProducto } from "../../services/productos";

// ✅ CSS
import "../../styles/crearProducto.css";

// Servicios de catálogos
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
  plataformasIds: [],
  generosIds: [],
  empresasIds: [],
  desarrolladoresIds: [],
  imagenes: "",
};

/* ---------------- MultiSelect ---------------- */
function MultiSelect({ label, items = [], selectedIds = [], onChange, placeholder }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  const current = Array.isArray(selectedIds) ? selectedIds : [];
  const selectedItems = items.filter((it) => current.includes(it.id));

  function toggle(id) {
    const exists = current.includes(id);
    const next = exists ? current.filter((x) => x !== id) : [...current, id];
    onChange(next);
  }

  function remove(id) {
    onChange(current.filter((x) => x !== id));
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="ms" ref={wrapperRef}>
      <label className="ms__label">{label}</label>

      <button type="button" className="ms__control" onClick={() => setOpen((v) => !v)}>
        <div className="ms__chips">
          {selectedItems.length === 0 ? (
            <span className="ms__placeholder">{placeholder}</span>
          ) : (
            selectedItems.map((it) => (
              <span key={it.id} className="ms__chip">
                {it.nombre}
                <button
                  type="button"
                  className="ms__chipx"
                  onClick={(e) => {
                    e.stopPropagation();
                    remove(it.id);
                  }}
                >
                  ×
                </button>
              </span>
            ))
          )}
        </div>
        <span className="ms__caret">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="ms__panel">
          {items.map((it) => (
            <label key={it.id} className="ms__item">
              <input
                type="checkbox"
                checked={current.includes(it.id)}
                onChange={() => toggle(it.id)}
              />
              <span>{it.nombre}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- Componente principal ---------------- */
export default function CrearProducto({
  modo = "crear",
  productoInicial = null,
  onFinish,
  onCancel, // ✅ cancelar edición
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

  // ✅ Links de compra por plataforma: { [plataformaId]: url }
  const [urlsCompra, setUrlsCompra] = useState({});

  // Cargar catálogos
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

  // Mapper nombre->id para edición (si el backend manda nombres)
  function mapNamesToIds(names = [], catalog = []) {
    const set = new Set(names.map((n) => String(n).trim().toLowerCase()));
    return catalog
      .filter((item) => set.has(String(item.nombre).trim().toLowerCase()))
      .map((item) => item.id);
  }

  // Cargar datos en modo editar (esperando catálogos)
  useEffect(() => {
    if (!productoInicial) {
      setFormData(INITIAL_FORM);
      setUrlsCompra({});
      return;
    }

    const catalogsReady =
      plataformas.length > 0 &&
      generos.length > 0 &&
      empresas.length > 0 &&
      desarrolladores.length > 0;

    if (!catalogsReady) return;

    setFormData({
      ...INITIAL_FORM,
      nombre: productoInicial.nombre ?? "",
      precio: productoInicial.precio ?? "",
      tipoProductoId: productoInicial.tipoProductoId ?? "",
      clasificacionId: productoInicial.clasificacionId ?? "",
      estadoId: productoInicial.estadoId ?? "",
      saga: productoInicial.saga ?? "",
      portadaSaga: productoInicial.portadaSaga ?? "",
      imagenes: (productoInicial.imagenes || []).join(", "),

      // si productoInicial trae nombres:
      plataformasIds: mapNamesToIds(productoInicial.plataformas ?? [], plataformas),
      generosIds: mapNamesToIds(productoInicial.generos ?? [], generos),
      empresasIds: mapNamesToIds(productoInicial.empresas ?? [], empresas),
      desarrolladoresIds: mapNamesToIds(productoInicial.desarrolladores ?? [], desarrolladores),
    });

    // ✅ Cargar linksCompra si viene
    setUrlsCompra(
      (productoInicial.linksCompra ?? []).reduce((acc, it) => {
        acc[it.plataformaId] = it.url;
        return acc;
      }, {})
    );
  }, [productoInicial, plataformas, generos, empresas, desarrolladores]);

  // ✅ Si desmarcas plataformas, elimina sus urlsCompra
  useEffect(() => {
    setUrlsCompra((prev) => {
      const next = {};
      for (const pid of formData.plataformasIds) {
        if (prev[pid]) next[pid] = prev[pid];
      }
      return next;
    });
  }, [formData.plataformasIds]);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const parseStrings = (value) =>
    value
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!formData.clasificacionId) {
      setError("Debe seleccionar una clasificación.");
      return;
    }

    if (!formData.tipoProductoId) {
      setError("Debe seleccionar un tipo de producto.");
      return;
    }

    if (!formData.estadoId) {
      setError("Debe seleccionar un estado.");
      return;
    }

    const payload = {
      nombre: formData.nombre,
      precio: Number(formData.precio),
      tipoProductoId: Number(formData.tipoProductoId),
      clasificacionId: Number(formData.clasificacionId),
      estadoId: Number(formData.estadoId),
      saga: formData.saga || null,
      portadaSaga: formData.portadaSaga || null,
    };

    // Listas
    if (formData.plataformasIds.length > 0) payload.plataformasIds = formData.plataformasIds;
    if (formData.generosIds.length > 0) payload.generosIds = formData.generosIds;
    if (formData.empresasIds.length > 0) payload.empresasIds = formData.empresasIds;
    if (formData.desarrolladoresIds.length > 0)
      payload.desarrolladoresIds = formData.desarrolladoresIds;

    // Imágenes
    if (formData.imagenes.trim() !== "") {
      payload.imagenesRutas = parseStrings(formData.imagenes);
    }

    // ✅ Links de compra por plataforma (dinámico)
    const linksCompra = Object.entries(urlsCompra)
      .filter(([_, url]) => url && url.trim() !== "")
      .map(([plataformaId, url]) => ({
        plataformaId: Number(plataformaId),
        url: url.trim(),
      }));

    if (linksCompra.length > 0) {
      payload.linksCompra = linksCompra;
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
        setUrlsCompra({});
      }

      if (onFinish) onFinish(result || null);
    } catch (err) {
      console.error(err);
      setError("Error al guardar: " + (err?.message || "desconocido"));
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
        required
      >
        <option value="">Seleccione clasificación</option>
        {clasificaciones.map((c) => (
          <option key={c.id} value={c.id}>
            {c.nombre}
          </option>
        ))}
      </select>


      {/* Estado */}
      <select name="estadoId" value={formData.estadoId} onChange={handleChange} required>
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
      <MultiSelect
        label="Plataformas"
        items={plataformas}
        selectedIds={formData.plataformasIds}
        onChange={(ids) => setFormData((prev) => ({ ...prev, plataformasIds: ids }))}
        placeholder="Selecciona plataformas..."
      />

      {/* ✅ Links de compra por plataforma */}
      <div className="buy-links">
        <h4 className="buy-links__title">Links de compra por plataforma</h4>

        {formData.plataformasIds.length === 0 ? (
          <p className="buy-links__hint">Selecciona plataformas para agregar links.</p>
        ) : (
          formData.plataformasIds.map((pid) => {
            const plat = plataformas.find((p) => p.id === pid);
            const nombrePlat = plat?.nombre ?? `Plataforma ${pid}`;

            return (
              <div key={pid} className="buy-links__row">
                <span className="buy-links__label">{nombrePlat}</span>

                <input
                  type="url"
                  className="buy-links__input"
                  placeholder={`URL para ${nombrePlat}`}
                  value={urlsCompra[pid] ?? ""}
                  onChange={(e) =>
                    setUrlsCompra((prev) => ({
                      ...prev,
                      [pid]: e.target.value,
                    }))
                  }
                />
              </div>
            );
          })
        )}
      </div>

      {/* Géneros */}
      <MultiSelect
        label="Géneros"
        items={generos}
        selectedIds={formData.generosIds}
        onChange={(ids) => setFormData((prev) => ({ ...prev, generosIds: ids }))}
        placeholder="Selecciona géneros..."
      />

      {/* Empresas */}
      <MultiSelect
        label="Empresas"
        items={empresas}
        selectedIds={formData.empresasIds}
        onChange={(ids) => setFormData((prev) => ({ ...prev, empresasIds: ids }))}
        placeholder="Selecciona empresas..."
      />

      {/* Desarrolladores */}
      <MultiSelect
        label="Desarrolladores"
        items={desarrolladores}
        selectedIds={formData.desarrolladoresIds}
        onChange={(ids) => setFormData((prev) => ({ ...prev, desarrolladoresIds: ids }))}
        placeholder="Selecciona desarrolladores..."
      />

      {/* ✅ Imagen del producto */}
      <div className="img-row">
        <span className="img-row__label">Imagen del producto</span>

        <input
          type="text"
          name="imagenes"
          className="img-row__input"
          placeholder="Url de imagen"
          value={formData.imagenes}
          onChange={handleChange}
        />
      </div>

      {/* Botones */}
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

        <button type="submit" className="btn-nl btn-nl-secondary">
          Guardar
        </button>
      </div>
    </form>
  );
}