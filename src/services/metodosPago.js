// ======================================================================
// Servicio: metodosPago.js
// Maneja el catálogo de Métodos de Pago de NoLimits
// ----------------------------------------------------------------------
// Operaciones incluidas:
//
// - LISTAR métodos de pago          (GET)
// - BUSCAR uno por nombre           (GET /buscar)
// - CREAR método de pago            (POST)
// - EDITAR COMPLETO                 (PUT)
// - EDITAR PARCIAL (PATCH)          (PATCH)
// - ELIMINAR                        (DELETE)
// - OBTENER por ID                  (GET /id)
//
// La API usa la misma base que el backend, obtenida desde .env
// ======================================================================


// ----------------------------------------------------------------------
// URL base de la API
// ----------------------------------------------------------------------
const API_BASE =
  import.meta.env.VITE_API_URL ||
  "https://nolimits-backend-final.onrender.com";


// ======================================================================
// LISTAR MÉTODOS DE PAGO
// GET /api/v1/metodos-pago
// GET /api/v1/metodos-pago/buscar/{nombre}
//
// - Si "search" tiene texto, se llama al endpoint de búsqueda.
// - Si está vacío, se obtiene toda la lista.
// - El backend a veces devuelve un array y otras veces un solo objeto,
//   así que normalizamos el resultado.
// ======================================================================
export async function listarMetodosPago(page = 1, search = "") {

  const trimmed = search.trim();

  // Endpoint base con paginación
  let endpoint = `${API_BASE}/api/v1/metodos-pago/paginado?page=${page}&size=4`;

  // Si hay búsqueda, se agrega ?search=
  if (trimmed.length > 0) {
    endpoint += `&search=${encodeURIComponent(trimmed)}`;
  }

  console.log("[listarMetodosPago] endpoint:", endpoint);

  const res = await fetch(endpoint);

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    console.error("[listarMetodosPago] Error HTTP:", res.status, txt);
    throw new Error("Error cargando métodos de pago");
  }

  const data = await res.json();
  console.log("[listarMetodosPago] raw paginated:", data);

  // Aseguramos que venga contenido y totalPaginas
  return {
    contenido: data.contenido || [],
    totalPaginas: data.totalPaginas || 1,
  };
}


// ======================================================================
// CREAR MÉTODO DE PAGO
// POST /api/v1/metodos-pago
//
// payload ejemplo:
// { nombre: "Tarjeta Débito", activo: true }
// ======================================================================
export async function crearMetodoPago(payload) {

  const res = await fetch(`${API_BASE}/api/v1/metodos-pago`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  // Manejo de errores con JSON detallado si existe
  if (!res.ok) {
    let err;
    try {
      err = await res.json();
    } catch {
      throw new Error("Error al crear método de pago");
    }
    throw new Error(err.message || "Error al crear método de pago");
  }

  return res.json();
}


// ======================================================================
// EDITAR COMPLETO (PUT)
// PUT /api/v1/metodos-pago/{id}
//
// PUT reemplaza todo el objeto. payload completo.
// ======================================================================
export async function editarMetodoPago(id, payload) {

  const res = await fetch(`${API_BASE}/api/v1/metodos-pago/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let err;
    try {
      err = await res.json();
    } catch {
      throw new Error("Error al editar método de pago");
    }
    throw new Error(err.message || "Error al editar método de pago");
  }

  return res.json();
}


// ======================================================================
// EDITAR PARCIALMENTE (PATCH)
// PATCH /api/v1/metodos-pago/{id}
//
// PATCH solo modifica campos específicos del objeto.
// ejemplo payload:
// { activo: false }
// ======================================================================
export async function patchMetodoPago(id, payload) {

  const res = await fetch(`${API_BASE}/api/v1/metodos-pago/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Error en PATCH de método de pago");

  return res.json();
}


// ======================================================================
// ELIMINAR MÉTODO DE PAGO
// DELETE /api/v1/metodos-pago/{id}
//
// Si elimina correctamente, retornamos true.
// ======================================================================
export async function eliminarMetodoPago(id) {

  const res = await fetch(`${API_BASE}/api/v1/metodos-pago/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Error al eliminar método de pago");

  return true;
}


// ======================================================================
// OBTENER POR ID
// GET /api/v1/metodos-pago/{id}
//
// Retorna un método de pago específico.
// ======================================================================
export async function obtenerMetodoPago(id) {

  const res = await fetch(`${API_BASE}/api/v1/metodos-pago/${id}`);

  if (!res.ok) throw new Error("Error al obtener método de pago");

  return res.json();
}