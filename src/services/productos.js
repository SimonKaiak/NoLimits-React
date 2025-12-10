// Ruta: src/services/productos.js
// ======================================================================
// Servicio: productos.js
// Encargado de manejar todas las operaciones de productos.
// Incluye:
//
// - LISTAR productos
// - LISTAR productos paginados
// - CREAR producto
// - OBTENER producto por ID
// - EDITAR producto completo (PUT)
// - ELIMINAR producto
// - SAGAS (obtener sagas y productos por saga)
// - CATÁLOGOS (tipos, clasificaciones, estados, plataformas, géneros,
//              empresas, desarrolladores)
// ======================================================================


// ----------------------------------------------------------------------
// API_BASE 
// ----------------------------------------------------------------------
// Dejamos la base SIN /api y lo agregamos en cada endpoint para
// que sea consistente con usuarios.js
const API_BASE =
  import.meta.env.VITE_API_URL ||
  "https://nolimits-backend-final.onrender.com";

// --- Cache simple en memoria para productos ---------------------------------
let _productosCache = null;
let _productosCacheTime = 0;
const PRODUCTOS_CACHE_TTL = 1000 * 60; // 1 minuto

function setProductosCache(list) {
  _productosCache = Array.isArray(list) ? list : [];
  _productosCacheTime = Date.now();
}

function clearProductosCache() {
  _productosCache = null;
  _productosCacheTime = 0;
}

// ======================================================================
// LISTAR TODOS LOS PRODUCTOS
// GET /api/v1/productos
// ======================================================================
export async function listarProductos({ force = false } = {}) {
  // 1) Si tengo cache fresco, lo devuelvo al tiro
  if (
    !force &&
    _productosCache &&
    Date.now() - _productosCacheTime < PRODUCTOS_CACHE_TTL
  ) {
    return _productosCache;
  }

  const url = `${API_BASE}/api/v1/productos`;
  const res = await fetch(url);
  const text = await res.text();

  if (!res.ok) {
    throw new Error("Status " + res.status + " -> " + text);
  }

  let data;
  try {
    data = JSON.parse(text);
  } catch {
    setProductosCache([]);
    return [];
  }

  let list = [];
  if (Array.isArray(data)) list = data;
  else if (Array.isArray(data.contenido)) list = data.contenido;
  else if (Array.isArray(data.content)) list = data.content;

  setProductosCache(list);
  return list;
}

// LISTAR PRODUCTOS PAGINADOS (front: 1-based, back: 1-based)
export async function listarProductosPaginado(page = 1, size = 3) {
  // Aseguramos un número mínimo 1
  const safePage = !Number.isFinite(Number(page)) || page < 1 ? 1 : Number(page);

  // OJO: aquí ya NO restamos 1
  const url = `${API_BASE}/api/v1/productos/paginacion?page=${safePage}&size=${size}`;

  const res = await fetch(url);
  const text = await res.text();

  if (!res.ok) {
    throw new Error("Status " + res.status + " -> " + text);
  }

  let raw;
  try {
    raw = JSON.parse(text);
  } catch {
    return {
      content: [],
      page: 1,
      totalPages: 1,
      totalElements: 0,
    };
  }

  const content = raw.content || raw.contenido || [];

  return {
    content,
    page: raw.page ?? safePage,
    totalPages: raw.totalPages ?? raw.totalPaginas ?? 1,
    totalElements: raw.totalElements ?? raw.totalElementos ?? content.length,
  };
}

// ======================================================================
// CREAR PRODUCTO
// POST /api/v1/productos
// ======================================================================
export async function crearProducto(data) {
  const url = `${API_BASE}/api/v1/productos`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const text = await res.text();

  if (!res.ok) {
    throw new Error(text || "Error al crear producto");
  }

  let result = null;
  try {
    result = JSON.parse(text);
  } catch {
    result = null;
  }

  clearProductosCache(); // invalidamos cache
  return result;
}

// ======================================================================
// OBTENER PRODUCTO POR ID
// GET /api/v1/productos/{id}
// ======================================================================
export async function obtenerProducto(id) {
  const url = `${API_BASE}/api/v1/productos/${id}`;

  const res = await fetch(url);
  const text = await res.text();

  if (!res.ok) {
    throw new Error("Status " + res.status + " -> " + text);
  }

  return JSON.parse(text);
}


// ======================================================================
// EDITAR PRODUCTO (PUT)
// PUT /api/v1/productos/{id}
// ======================================================================
export async function editarProducto(id, data) {
  const url = `${API_BASE}/api/v1/productos/${id}`;

  const res = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const text = await res.text();

  if (!res.ok) {
    throw new Error(text || "Error al editar producto");
  }

  let result = null;
  try {
    result = JSON.parse(text);
  } catch {
    result = null;
  }

  clearProductosCache(); // invalidamos cache
  return result;
}

// ======================================================================
// ELIMINAR PRODUCTO
// DELETE /api/v1/productos/{id}
// ======================================================================
export async function eliminarProducto(id) {
  const url = `${API_BASE}/api/v1/productos/${id}`;

  const res = await fetch(url, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Error al eliminar producto");
  }

  clearProductosCache(); // invalidamos cache
}

// ======================================================================
// OBTENER LISTA DE SAGAS (para el carrusel)
// /api/v1/productos/sagas/resumen
// ======================================================================
export async function obtenerSagas() {
  const url = `${API_BASE}/api/v1/productos/sagas/resumen`;

  const res = await fetch(url);
  const text = await res.text();

  if (!res.ok) {
    throw new Error("Status " + res.status + " -> " + text);
  }

  if (!text) return [];

  let data;
  try {
    data = JSON.parse(text);
  } catch {
    return [];
  }

  if (!Array.isArray(data)) return [];

  // Normalizamos a objetos { nombre, portadaSaga }
  return data
    .map((s) => ({
      nombre: typeof s.nombre === "string" ? s.nombre : "",
      portadaSaga:
        typeof s.portadaSaga === "string" && s.portadaSaga.trim().length > 0
          ? s.portadaSaga
          : null,
    }))
    .filter((s) => s.nombre); // eliminamos los vacíos
}


// ======================================================================
// OBTENER PRODUCTOS POR SAGA (front)
// ======================================================================
export async function obtenerProductosPorSaga(nombreSaga) {
  const productos = await listarProductos();

  const target =
    typeof nombreSaga === "string"
      ? nombreSaga.trim().toLowerCase()
      : "";

  return productos.filter((p) => {
    const saga =
      typeof p.saga === "string"
        ? p.saga.trim().toLowerCase()
        : "";
    return saga === target;
  });
}


// ======================================================================
// CATÁLOGOS: TIPOS DE PRODUCTO
// GET /api/v1/tipo-productos
// ======================================================================
export async function obtenerTiposProducto() {
  const url = `${API_BASE}/api/v1/tipo-productos`;

  const res = await fetch(url);
  const text = await res.text();

  if (!res.ok) {
    throw new Error("Status " + res.status + " -> " + text);
  }

  try {
    return JSON.parse(text);
  } catch {
    return [];
  }
}

// ======================================================================
// CATÁLOGOS: CLASIFICACIONES
// GET /api/v1/clasificaciones
// ======================================================================
export async function obtenerClasificaciones() {
  const url = `${API_BASE}/api/v1/clasificaciones`;

  const res = await fetch(url);
  const text = await res.text();

  if (!res.ok) {
    throw new Error("Status " + res.status + " -> " + text);
  }

  try {
    return JSON.parse(text);
  } catch {
    return [];
  }
}

// ======================================================================
// CATÁLOGOS: ESTADOS DE PRODUCTO
// GET /api/v1/estados
// ======================================================================
export async function obtenerEstadosProducto() {
  const url = `${API_BASE}/api/v1/estados`;

  const res = await fetch(url);
  const text = await res.text();

  if (!res.ok) {
    throw new Error("Status " + res.status + " -> " + text);
  }

  try {
    return JSON.parse(text);
  } catch {
    return [];
  }
}

// ======================================================================
// HELPER GENÉRICO PARA CATÁLOGOS PAGINADOS
// (SIN fallback a endpoints que no existen)
// ======================================================================
async function fetchCatalogoPaged(url, label) {
  const res = await fetch(`${API_BASE}${url}`);
  const text = await res.text();

  if (!res.ok) {
    console.error(`[${label}] Error HTTP`, res.status, text);
    throw new Error(text || `Error cargando ${label}`);
  }

  let data;
  try {
    data = JSON.parse(text);
  } catch {
    console.error(`[${label}] Respuesta no es JSON`, text);
    return [];
  }

  console.log(`[${label}] respuesta cruda =>`, data);

  if (Array.isArray(data)) {
    return data;
  }

  return data.content || data.contenido || [];
}

// ======================================================================
// CATÁLOGOS: PLATAFORMAS
// GET /api/v1/plataformas/paginado?page=1&size=100
// ======================================================================
export async function obtenerPlataformas() {
  return fetchCatalogoPaged(
    "/api/v1/plataformas/paginado?page=1&size=100",
    "PLATAFORMAS"
  );
}

// ======================================================================
// CATÁLOGOS: GÉNEROS
// GET /api/v1/generos/paginado?page=1&size=100
// ======================================================================
export async function obtenerGeneros() {
  return fetchCatalogoPaged(
    "/api/v1/generos/paginado?page=1&size=100",
    "GENEROS"
  );
}

// ======================================================================
// CATÁLOGOS: EMPRESAS
// GET /api/v1/empresas/paginado?page=1&size=100
// ======================================================================
export async function obtenerEmpresas() {
  return fetchCatalogoPaged(
    "/api/v1/empresas/paginado?page=1&size=100",
    "EMPRESAS"
  );
}

// ======================================================================
// CATÁLOGOS: DESARROLLADORES
// GET /api/v1/desarrolladores/paginado?page=1&size=100
// ======================================================================
export async function obtenerDesarrolladores() {
  return fetchCatalogoPaged(
    "/api/v1/desarrolladores/paginado?page=1&size=100",
    "DESARROLLADORES"
  );
}