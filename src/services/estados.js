// ============================================================
// Servicio: estados.js
// Maneja todas las operaciones CRUD del catálogo "Estados"
// ------------------------------------------------------------
// Este servicio permite:
// - Listar estados
// - Buscar estado por nombre
// - Crear un estado
// - Editar estado (PUT)
// - Editar parcialmente un estado (PATCH)
// - Eliminar un estado
// - Obtener estado por ID
// ============================================================

// URL base del backend para API v1
const API_BASE = "https://nolimits-backend-final.onrender.com/api/v1";

// URL principal del recurso "estados"
const API_URL = `${API_BASE}/estados`;


// ====================================================================
// LISTAR ESTADOS (GET /estados)
// --------------------------------------------------------------------
// - page: por compatibilidad, pero el backend no usa paginación.
// - search: si el usuario escribe un nombre, usamos el endpoint
//           /estados/nombre/{texto} que filtra desde el backend.
//
// EJEMPLOS:
// listarEstados() trae todos
// listarEstados(1, "Activo")  GET /estados/nombre/Activo
// ====================================================================
export async function listarEstados(page = 1, search = "") {

  const params = new URLSearchParams({
    page,
    size: 4,
    search
  });

  const res = await fetch(`${API_URL}/paginado?${params.toString()}`);

  if (!res.ok) throw new Error("Error cargando estados paginados");

  return res.json();
}


// ====================================================================
// CREAR ESTADO (POST /estados)
// --------------------------------------------------------------------
// payload ejemplo:
// { nombre: "Activo" }
//
// Retorna el estado creado.
// ====================================================================
export async function crearEstado(payload) {

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!res.ok) throw new Error("Error al crear estado");

  return res.json();
}


// ====================================================================
// EDITAR ESTADO COMPLETO (PUT /estados/:id)
// --------------------------------------------------------------------
// PUT reemplaza completamente el estado.
// payload ejemplo:
// { nombre: "Inactivo" }
// ====================================================================
export async function editarEstado(id, payload) {

  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!res.ok) throw new Error("Error al editar estado");

  return res.json();
}


// ====================================================================
// EDITAR ESTADO PARCIAL (PATCH /estados/:id)
// --------------------------------------------------------------------
// PATCH actualiza solo los campos enviados.
// payloadParcial ejemplo:
// { nombre: "Suspendido" }
// ====================================================================
export async function patchEstado(id, payloadParcial) {

  const res = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payloadParcial)
  });

  if (!res.ok) throw new Error("Error en patch estado");

  return res.json();
}


// ====================================================================
// ELIMINAR ESTADO (DELETE /estados/:id)
// --------------------------------------------------------------------
// Si elimina correctamente, retornamos true.
// ====================================================================
export async function eliminarEstado(id) {

  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE"
  });

  if (!res.ok) throw new Error("Error al eliminar estado");

  return true;
}


// ====================================================================
// OBTENER ESTADO POR ID (GET /estados/:id)
// --------------------------------------------------------------------
// Retorna el estado encontrado, o error si no existe.
// ====================================================================
export async function obtenerEstado(id) {

  const res = await fetch(`${API_URL}/${id}`);

  if (!res.ok) throw new Error("Error al obtener estado");

  return res.json();
}