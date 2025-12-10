// ======================================================================
// Servicio: plataformas.js
// Maneja todo el CRUD del catálogo de Plataformas (PS5, Xbox, PC, etc.)
// ----------------------------------------------------------------------
// Funciones incluidas:
//
// - LISTAR plataformas (GET)
// - CREAR plataforma (POST)
// - EDITAR completa (PUT)
// - EDITAR parcial (PATCH)
// - ELIMINAR plataforma (DELETE)
// - OBTENER plataforma por ID (GET)
//
// ======================================================================

// ----------------------------------------------------------------------
// URL base del backend (v1)
// ----------------------------------------------------------------------
const API_BASE = "https://nolimits-backend-final.onrender.com/api/v1";

// Endpoint principal para plataformas
const API_URL = `${API_BASE}/plataformas`;

// ======================================================================
// LISTAR PLATAFORMAS
// GET /plataformas/paginado
//
// - Trae plataformas paginadas
// - Si viene un "search", filtramos manualmente en el FRONT
// ======================================================================
export async function listarPlataformas(page = 1, search = "") {
  // Usamos el endpoint paginado real del backend
  const url = `${API_URL}/paginado?page=${page}&size=4`;

  const res = await fetch(url);

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    console.error("Error cargando plataformas:", res.status, txt);
    throw new Error("Error cargando plataformas");
  }

  const data = await res.json();

  // Si no hay búsqueda, devolvemos tal cual
  if (!search || !search.trim()) {
    return data;
  }

  // Si HAY búsqueda, filtramos solo el contenido
  const needle = search.trim().toLowerCase();

  const filtrado = (data.contenido || []).filter((item) =>
    (item.nombre || "").toLowerCase().includes(needle)
  );

  return {
    contenido: filtrado,
    pagina: data.pagina,
    totalPaginas: data.totalPaginas,
    totalElementos: data.totalElementos,
  };
}

// ======================================================================
// CREAR PLATAFORMA
// POST /plataformas
//
// payload ejemplo:
// { nombre: "Nintendo Switch" }
// ======================================================================
export async function crearPlataforma(payload) {

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.text().catch(() => "");
    console.error("Error al crear plataforma:", res.status, error);
    throw new Error("Error al crear plataforma");
  }

  return res.json();
}


// ======================================================================
// EDITAR COMPLETO (PUT)
// PUT /plataformas/{id}
//
// - Reemplaza todo el objeto en el backend
// ======================================================================
export async function editarPlataforma(id, payload) {

  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.text().catch(() => "");
    console.error("Error al editar plataforma:", res.status, error);
    throw new Error("Error al editar plataforma");
  }

  return res.json();
}


// ======================================================================
// EDITAR PARCIAL (PATCH)
// PATCH /plataformas/{id}
//
// - Permite modificar solo campos específicos
// - Ejemplo: { nombre: "PS5 Digital Edition" }
// ======================================================================
export async function patchPlataforma(id, payload) {

  const res = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.text().catch(() => "");
    console.error("Error al actualizar parcialmente:", res.status, error);
    throw new Error("Error al actualizar parcialmente");
  }

  return res.json();
}


// ======================================================================
// ELIMINAR PLATAFORMA
// DELETE /plataformas/{id}
//
// - Si elimina correctamente, retornamos true
// ======================================================================
export async function eliminarPlataforma(id) {

  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const error = await res.text().catch(() => "");
    console.error("Error al eliminar plataforma:", res.status, error);
    throw new Error("Error al eliminar plataforma");
  }

  return true;
}


// ======================================================================
// OBTENER POR ID
// GET /plataformas/{id}
//
// - Retorna los datos completos de una plataforma específica
// ======================================================================
export async function obtenerPlataforma(id) {

  const res = await fetch(`${API_URL}/${id}`);

  if (!res.ok) {
    const error = await res.text().catch(() => "");
    console.error("Error al obtener plataforma:", res.status, error);
    throw new Error("Error al obtener plataforma");
  }

  return res.json();
}