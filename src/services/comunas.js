// ===============================================
// Servicio: comunas.js
// Funciones para obtener comunas desde el backend
// ===============================================

// API_BASE define la URL base del backend.
const API_BASE =
  import.meta.env.VITE_API_URL ||
  "https://nolimits-backend-final.onrender.com";


// ---------------------------------------------------------------
// Función: obtenerComunas()
// Hace una petición GET al endpoint /api/comunas del backend.
//
// Paso a paso:
// - Se conecta al servidor usando fetch()
// - Si la respuesta NO es correcta (res.ok === false), lanza un error
// - Si todo está bien, convierte la respuesta a JSON y la retorna
// ---------------------------------------------------------------
export async function obtenerComunas() {

  // Petición HTTP al backend
  const res = await fetch(`${API_BASE}/api/comunas`);

  // Validación: si la respuesta falla, lanzamos un error controlado
  if (!res.ok) throw new Error("Error cargando comunas");

  // Convertimos la respuesta del servidor a JSON
  return res.json();
}

// =====================================================
// CREAR COMUNA
// =====================================================
export async function crearComuna(payload) {
  const res = await fetch(`${API_BASE}/api/comunas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Error al crear comuna");
  return res.json();
}

// =====================================================
// EDITAR COMUNA (PUT)
// =====================================================
export async function editarComuna(id, payload) {
  const res = await fetch(`${API_BASE}/api/comunas/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Error al editar comuna");
  return res.json();
}

// =====================================================
// ELIMINAR COMUNA
// =====================================================
export async function eliminarComuna(id) {
  const res = await fetch(`${API_BASE}/api/comunas/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Error al eliminar comuna");
  return true;
}