// ============================================================
// Servicio: direcciones.js
// Maneja CRUD de Direcciones del usuario
// ------------------------------------------------------------
// NOTAS IMPORTANTES:
// - Este servicio se usa cuando el usuario edita su perfil
//   (calle, número, complemento, comuna, región).
// - Las respuestas del backend se leen como texto para poder
//   capturar errores incluso si el backend no devuelve JSON válido.
// - Luego se intenta parsear manualmente con JSON.parse.
// ============================================================

// API_BASE:
const API_BASE =
  import.meta.env.VITE_API_URL ||
  "https://nolimits-backend-final.onrender.com";


// ===================================================================
// OBTENER dirección (GET /api/direcciones/:id)
// -------------------------------------------------------------------
// - id: ID de la dirección que queremos obtener.
// - Se lee el body como texto (res.text()) porque algunos servidores
//   devuelven HTML o string de error en vez de JSON.
// ===================================================================
export async function obtenerDireccion(id) {
  const res = await fetch(`${API_BASE}/api/direcciones/${id}`);
  const text = await res.text(); // leemos siempre como texto

  if (!res.ok) {
    console.error("[obtenerDireccion] status:", res.status, text);
    throw new Error("Error obteniendo dirección");
  }

  try {
    return JSON.parse(text); // convertimos texto a JSON
  } catch {
    throw new Error("Respuesta inválida al obtener dirección");
  }
}


// ===================================================================
// CREAR dirección (POST /api/direcciones)
// -------------------------------------------------------------------
// payload: {
//   calle: "...",
//   numero: "...",
//   complemento: "...",
//   comunaNombre o comunaId,
//   regionNombre o regionId,
//   usuarioId (si corresponde)
// }
// ===================================================================
export async function crearDireccion(payload) {

  const res = await fetch(`${API_BASE}/api/direcciones`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const text = await res.text(); // leemos respuesta como texto

  if (!res.ok) {
    console.error("[crearDireccion] status:", res.status, text);
    throw new Error("Error al crear dirección");
  }

  // Intentamos parsear JSON, si falla, devolvemos null
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}


// ===================================================================
// ACTUALIZAR dirección (PATCH /api/direcciones/:id)
// -------------------------------------------------------------------
// - Puedes enviar uno o varios campos del payload.
// - PATCH se usa para actualizar parcialmente la dirección.
// ===================================================================
export async function actualizarDireccion(id, payload) {

  const res = await fetch(`${API_BASE}/api/direcciones/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const text = await res.text(); // respuesta cruda

  if (!res.ok) {
    console.error("[actualizarDireccion] status:", res.status, text);
    throw new Error("Error al actualizar dirección");
  }

  // Intentamos parsear JSON de la respuesta
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export async function listarDirecciones() {
  const res = await fetch(`${API_BASE}/api/direcciones`);
  const text = await res.text();

  if (!res.ok) throw new Error("Error cargando direcciones");

  try {
    return JSON.parse(text);
  } catch {
    return [];
  }
}

export async function eliminarDireccion(id) {
  const res = await fetch(`${API_BASE}/api/direcciones/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Error al eliminar dirección");

  return true;
}