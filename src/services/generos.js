// ============================================================
// Servicio: generos.js
// Maneja todas las operaciones CRUD del catálogo "Géneros"
// ------------------------------------------------------------
// Este servicio permite:
// - Listar géneros (con búsqueda por nombre)
// - Crear un género
// - Editar género (PUT completo)
// - Editar género parcialmente (PATCH)
// - Eliminar género
// - Obtener género por ID
//
// ============================================================

// URL base de la API
const API_BASE = "https://nolimits-backend-final.onrender.com/api/v1";

// URL principal del recurso "géneros"
const API_URL = `${API_BASE}/generos`;


// ====================================================================
// LISTAR GÉNEROS (GET /generos)
// --------------------------------------------------------------------
// - page: por compatibilidad, el backend no usa paginación aún.
// - search: si viene texto, usamos el endpoint backend
//           /generos/nombre/{texto} que filtra por nombre.
//
// EJEMPLOS:
// listarGeneros() lista todo
// listarGeneros(1, "Acción") GET /generos/nombre/Acción
// ====================================================================
export async function listarGeneros(page = 1, search = "") {

  const params = new URLSearchParams();
  params.append("page", page);
  params.append("size", 4);
  params.append("search", search.trim());

  const res = await fetch(`${API_URL}/paginado?${params.toString()}`);

  if (!res.ok) {
    throw new Error("Error cargando géneros");
  }

  return res.json(); // devuelve { contenido, totalPaginas, totalElementos }
}


// ====================================================================
// CREAR GÉNERO (POST /generos)
// --------------------------------------------------------------------
// payload ejemplo:
// { nombre: "Acción" }
//
// Retorna el género creado.
// ====================================================================
export async function crearGenero(payload) {

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Error al crear género");
  }

  return res.json();
}


// ====================================================================
// EDITAR GÉNERO COMPLETO (PUT /generos/:id)
// --------------------------------------------------------------------
// PUT reemplaza TODO el recurso.
// payload ejemplo:
// { nombre: "Aventura" }
// ====================================================================
export async function editarGenero(id, payload) {

  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Error al editar género");
  }

  return res.json();
}


// ====================================================================
// EDITAR PARCIALMENTE (PATCH /generos/:id)
// --------------------------------------------------------------------
// PATCH permite enviar solo los campos a actualizar.
// payloadParcial ejemplo:
// { nombre: "Estrategia" }
// ====================================================================
export async function patchGenero(id, payloadParcial) {

  const res = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payloadParcial),
  });

  if (!res.ok) {
    throw new Error("Error al aplicar patch");
  }

  return res.json();
}


// ====================================================================
// ELIMINAR GÉNERO (DELETE /generos/:id)
// --------------------------------------------------------------------
// Si elimina correctamente, retornamos true.
// ====================================================================
export async function eliminarGenero(id) {

  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Error al eliminar");
  }

  return true;
}


// ====================================================================
// OBTENER GÉNERO POR ID (GET /generos/:id)
// --------------------------------------------------------------------
// Devuelve el género correspondiente al ID solicitado.
// ====================================================================
export async function obtenerGenero(id) {

  const res = await fetch(`${API_URL}/${id}`);

  if (!res.ok) {
    throw new Error("Error al obtener género");
  }

  return res.json();
}