// services / clasificaciones.js

/**
 * Este archivo contiene todas las funciones que permiten comunicarse con el backend
 * para trabajar con el recurso "Clasificaciones".
 *
 * Aquí se realizan peticiones HTTP al servidor usando fetch.
 * Cada función corresponde a una operación clásica:
 * - listar
 * - crear
 * - editar (PUT)
 * - actualizar parcialmente (PATCH)
 * - eliminar
 * - obtener una clasificación por id
 *
 * Todo se hace contra una API REST en /api/v1/clasificaciones
 */

// En esta constante se obtiene la URL base del backend.
const API_BASE =
  import.meta.env.VITE_API_URL ||
  "https://nolimits-backend-final.onrender.com";

// URL completa para trabajar con clasificaciones.
const API_URL = `${API_BASE}/api/v1/clasificaciones`;

/* ============================================================
   LISTAR CLASIFICACIONES
   GET /api/v1/clasificaciones
   ============================================================
   Esta función obtiene todas las clasificaciones desde el backend.
   Luego, opcionalmente aplica un filtro por nombre en el frontend.
*/
export async function listarClasificaciones(page = 1, search = "") {

  // Armar la URL correcta según parámetros
  const url = `${API_URL}/paginado?page=${page}&size=4&search=${encodeURIComponent(
    search.trim()
  )}`;

  const res = await fetch(url);

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    console.error("Error cargando clasificaciones:", res.status, txt);
    throw new Error("Error cargando clasificaciones");
  }

  // Ahora el backend SIEMPRE devuelve:
  // {
  //   contenido: [...],
  //   pagina: 1,
  //   totalPaginas: 3,
  //   totalElementos: 14
  // }
  return await res.json();
}

/* ============================================================
   CREAR CLASIFICACIÓN
   POST /api/v1/clasificaciones
   ============================================================
   Esta función envía un objeto 'payload' al backend para crear una nueva
   clasificación. El backend la guarda y devuelve la nueva clasificación creada.
*/
export async function crearClasificacion(payload) {
  const res = await fetch(API_URL, {
    method: "POST",                       // Se envía como POST.
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),        // Enviamos el cuerpo en formato JSON.
  });

  // Manejo de error básico si el backend responde con estado no exitoso.
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    console.error("Error al crear clasificación:", res.status, txt);
    throw new Error("Error al crear clasificación");
  }

  return res.json();                      // Devolvemos la clasificación creada.
}

/* ============================================================
   EDITAR CLASIFICACIÓN
   PUT /api/v1/clasificaciones/:id
   ============================================================
   PUT reemplaza todos los datos de la clasificación con los del payload.
*/
export async function editarClasificacion(id, payload) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",                         // Se usa PUT para sustitución total.
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    console.error("Error al editar clasificación:", res.status, txt);
    throw new Error("Error al editar clasificación");
  }

  return res.json();
}

/* ============================================================
   ACTUALIZACIÓN PARCIAL
   PATCH /api/v1/clasificaciones/:id
   ============================================================
   PATCH permite modificar solo algunos campos en lugar de todos.
*/
export async function patchClasificacion(id, payloadParcial) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",                        // Modifica parcialmente.
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payloadParcial),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    console.error("Error al aplicar patch clasificación:", res.status, txt);
    throw new Error("Error al aplicar patch");
  }

  return res.json();
}

/* ============================================================
   ELIMINAR CLASIFICACIÓN
   DELETE /api/v1/clasificaciones/:id
   ============================================================
   Esta función envía una petición para eliminar una clasificación.
   Si todo va bien, simplemente retorna true.
*/
export async function eliminarClasificacion(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    console.error("Error al eliminar clasificación:", res.status, txt);
    throw new Error("Error al eliminar");
  }

  return true;
}

/* ============================================================
   OBTENER CLASIFICACIÓN POR ID
   GET /api/v1/clasificaciones/:id
   ============================================================
   Esta función obtiene una sola clasificación usando su ID.
*/
export async function obtenerClasificacion(id) {
  const res = await fetch(`${API_URL}/${id}`);

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    console.error("Error al obtener clasificación:", res.status, txt);
    throw new Error("Error al obtener clasificación");
  }

  return res.json();                        // Devuelve la clasificación encontrada.
}