// ======================================================================
// Servicio: metodosEnvio.js
// Gestión completa del catálogo "Métodos de Envío"
// ----------------------------------------------------------------------
// Este archivo maneja todas las operaciones CRUD:
//
// - LISTAR métodos de envío  (GET /api/v1/metodos-envio)
// - BUSCAR por nombre        (filtro aplicado en el FRONT)
// - CREAR                    (POST)
// - EDITAR completo          (PUT)
// - EDITAR parcial           (PATCH)
// - ELIMINAR                 (DELETE)
// - OBTENER POR ID           (GET /{id})
//
// ======================================================================

// URL base 
const API_BASE =
  import.meta.env.VITE_API_URL ||
  "https://nolimits-backend-final.onrender.com";


// ======================================================================
// LISTAR MÉTODOS DE ENVÍO (GET /metodos-envio)
// ----------------------------------------------------------------------
// - page: solo por compatibilidad, el backend no pagina aún.
// - search: filtro por nombre, aplicado en el FRONT.
//
// Flujo:
// 1. Llamamos al backend
// 2. Si viene search, filtramos aquí
// 3. Devolvemos { contenido, totalPaginas: 1 }
// ======================================================================
export async function listarMetodosEnvio(page = 1, search = "") {

  // Endpoint paginado real
  let endpoint = `${API_BASE}/api/v1/metodos-envio/paginado?page=${page}&size=4`;

  // Si hay búsqueda, se la agregamos al backend
  if (search.trim().length > 0) {
    endpoint += `&search=${encodeURIComponent(search.trim())}`;
  }

  console.log("[listarMetodosEnvio] endpoint:", endpoint);

  const res = await fetch(endpoint);

  if (!res.ok) {
    const txt = await res.text();
    console.error("[listarMetodosEnvio] Error HTTP:", res.status, txt);
    throw new Error("Error cargando métodos de envío");
  }

  // El backend devuelve el paginado real
  const data = await res.json();
  console.log("[listarMetodosEnvio] raw data:", data);

  return {
    contenido: data.contenido || [],
    totalPaginas: data.totalPaginas || 1
  };
}

// ======================================================================
// CREAR MÉTODO DE ENVÍO (POST)
// ----------------------------------------------------------------------
// payload ejemplo:
// { nombre: "Envío Express", activo: true }
// ======================================================================
export async function crearMetodoEnvio(payload) {

  const res = await fetch(`${API_BASE}/api/v1/metodos-envio`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || "Error al crear método de envío");
  }

  return res.json();
}


// ======================================================================
// EDITAR COMPLETO (PUT /metodos-envio/:id)
// ----------------------------------------------------------------------
// PUT reemplaza TODO el objeto.
// payload ejemplo:
// { nombre: "Retiro en tienda", activo: false }
// ======================================================================
export async function editarMetodoEnvio(id, payload) {

  const res = await fetch(`${API_BASE}/api/v1/metodos-envio/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || "Error al editar método de envío");
  }

  return res.json();
}


// ======================================================================
// EDITAR PARCIALMENTE (PATCH /metodos-envio/:id)
// ----------------------------------------------------------------------
// PATCH solo actualiza campos específicos.
// payload ejemplo:
// { activo: true }
// ======================================================================
export async function patchMetodoEnvio(id, payload) {

  const res = await fetch(`${API_BASE}/api/v1/metodos-envio/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Error al actualizar método de envío");
  return res.json();
}


// ======================================================================
// ELIMINAR (DELETE /metodos-envio/:id)
// ----------------------------------------------------------------------
// Si la operación es exitosa, retornamos true.
// ======================================================================
export async function eliminarMetodoEnvio(id) {

  const res = await fetch(`${API_BASE}/api/v1/metodos-envio/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Error al eliminar método de envío");
  return true;
}


// ======================================================================
// OBTENER POR ID (GET /metodos-envio/:id)
// ----------------------------------------------------------------------
// Retorna un método de envío específico.
// ======================================================================
export async function obtenerMetodoEnvio(id) {

  const res = await fetch(`${API_BASE}/api/v1/metodos-envio/${id}`);

  if (!res.ok) throw new Error("Error al obtener método de envío");

  return res.json();
}