// ============================================================
// Servicio: empresas.js
// Maneja todas las operaciones CRUD de "Empresas"
// ------------------------------------------------------------
// Este servicio permite:
// - Listar empresas
// - Buscar empresas por nombre (en el front)
// - Crear una empresa
// - Editar completamente una empresa (PUT)
// - Editar parcialmente una empresa (PATCH)
// - Eliminar una empresa
// - Obtener empresa por ID
// ============================================================

// API_BASE:
const API_BASE = "https://nolimits-backend-final.onrender.com/api/v1";

// URL completa del recurso "empresas"
const API_URL = `${API_BASE}/empresas`;


// ====================================================================
// LISTAR EMPRESAS (GET /empresas)
// --------------------------------------------------------------------
// - page: por compatibilidad futura (no afecta aquí).
// - search: texto que escribe el usuario para buscar por nombre.
// - El backend devuelve una lista completa, sin paginación real.
// - Si viene search, filtramos desde el frontend.
// ====================================================================
export async function listarEmpresas(page = 1, search = "") {

  let url = `${API_URL}/paginado?page=${page}&size=4`;

  const res = await fetch(url);

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    console.error("Error cargando empresas:", res.status, txt);
    throw new Error("Error cargando empresas");
  }

  const data = await res.json();

  // Si no hay búsqueda - devolvemos tal cual
  if (!search || !search.trim()) {
    return data;
  }

  const needle = search.trim().toLowerCase();
  const filtrado = data.contenido.filter((item) =>
    (item.nombre || "").toLowerCase().includes(needle)
  );

  return {
    contenido: filtrado,
    pagina: data.pagina,
    totalPaginas: data.totalPaginas,
    totalElementos: data.totalElementos
  };
}

// ====================================================================
// CREAR EMPRESA (POST /empresas)
// --------------------------------------------------------------------
// payload: objeto con los datos de la empresa nueva, por ejemplo:
// {
//   nombre: "Ubisoft",
//   activo: true
// }
// ====================================================================
export async function crearEmpresa(payload) {

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.text().catch(() => "");
    console.error("Error al crear empresa:", res.status, error);
    throw new Error("Error al crear empresa");
  }

  return res.json();
}


// ====================================================================
// EDITAR EMPRESA COMPLETA (PUT /empresas/:id)
// --------------------------------------------------------------------
// PUT reemplaza toda la empresa en el backend.
// ====================================================================
export async function editarEmpresa(id, payload) {

  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.text().catch(() => "");
    console.error("Error al editar empresa:", res.status, error);
    throw new Error("Error al editar empresa");
  }

  return res.json();
}


// ====================================================================
// EDITAR EMPRESA PARCIAL (PATCH /empresas/:id)
// --------------------------------------------------------------------
// PATCH se usa para actualizar solo algunos campos.
// Ejemplo:
// patchEmpresa(5, { activo: false });
// ====================================================================
export async function patchEmpresa(id, payload) {

  const res = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.text().catch(() => "");
    console.error("Error en PATCH empresa:", res.status, error);
    throw new Error("Error en PATCH empresa");
  }

  return res.json();
}


// ====================================================================
// ELIMINAR EMPRESA (DELETE /empresas/:id)
// --------------------------------------------------------------------
// Si elimina correctamente, retorna true.
// ====================================================================
export async function eliminarEmpresa(id) {

  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const error = await res.text().catch(() => "");
    console.error("Error al eliminar empresa:", res.status, error);
    throw new Error("Error al eliminar empresa");
  }

  return true;
}


// ====================================================================
// OBTENER EMPRESA POR ID (GET /empresas/:id)
// --------------------------------------------------------------------
// Devuelve la empresa buscada, o lanza error si no existe.
// ====================================================================
export async function obtenerEmpresa(id) {

  const res = await fetch(`${API_URL}/${id}`);

  if (!res.ok) {
    const error = await res.text().catch(() => "");
    console.error("Error al obtener empresa:", res.status, error);
    throw new Error("Error al obtener empresa");
  }

  return res.json();
}