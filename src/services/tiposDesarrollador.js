// Ruta: src/services/tiposDesarrollador.js

const API_BASE =
  import.meta.env.VITE_API_URL ||
  "https://nolimits-backend-final.onrender.com";

const API_URL = `${API_BASE}/api/v1/tipos-desarrollador`;

// ==========================================================
// Helpers de Auth (JWT)
// ==========================================================
function getToken() {
  return typeof window !== "undefined" ? localStorage.getItem("nl_token") : null;
}

function authHeaders(extra = {}) {
  const token = getToken();
  return {
    ...extra,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

/* ======================================================================
   LISTAR TIPOS DE DESARROLLADOR (paginado)
   GET /api/v1/tipos-desarrollador/paginado?page=&size=
   ====================================================================== */
export async function listarTiposDesarrollador(pagina = 1, busqueda = "") {
  const endpoint = `${API_URL}/paginado?page=${pagina}&size=4`;

  const res = await fetch(endpoint, {
    headers: authHeaders(),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    console.error("Error listar tipos desarrollador:", res.status, txt);
    throw new Error("Error al listar tipos de desarrollador");
  }

  const data = await res.json();

  if (busqueda.trim().length > 0) {
    const needle = busqueda.toLowerCase();
    data.contenido = (data.contenido || []).filter((t) =>
      (t.nombre || "").toLowerCase().includes(needle)
    );
  }

  return data;
}

/* ======================================================================
   OBTENER TIPO POR ID
   ====================================================================== */
export async function obtenerTipoDesarrollador(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    headers: authHeaders(),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    console.error("Error obtener tipo desarrollador:", res.status, txt);
    throw new Error("Error al obtener tipo de desarrollador");
  }

  return await res.json();
}

/* ======================================================================
   CREAR
   ====================================================================== */
export async function crearTipoDesarrollador(data) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    console.error("Error crear tipo desarrollador:", res.status, txt);
    throw new Error("Error al crear tipo de desarrollador");
  }

  return await res.json();
}

/* ======================================================================
   ACTUALIZAR (PUT)
   ====================================================================== */
export async function actualizarTipoDesarrollador(id, data) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    console.error("Error actualizar tipo desarrollador:", res.status, txt);
    throw new Error("Error al actualizar tipo de desarrollador");
  }

  return await res.json();
}

/* ======================================================================
   ELIMINAR
   ====================================================================== */
export async function eliminarTipoDesarrollador(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    console.error("Error eliminar tipo desarrollador:", res.status, txt);
    throw new Error("Error al eliminar tipo de desarrollador");
  }

  return true;
}