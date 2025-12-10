// ======================================================================
// Servicio: regiones.js
// Encargado de obtener la lista de regiones desde el backend.
//
//
// GET /api/v2/regiones
// ======================================================================


// ----------------------------------------------------------------------
// API_BASE 
// ----------------------------------------------------------------------
const API_BASE =
  import.meta.env.VITE_API_URL ||
  "https://nolimits-backend-final.onrender.com";


// ======================================================================
// obtenerRegiones() — compatible con HATEOAS
// ----------------------------------------------------------------------
// Devuelve SIEMPRE un array simple:
// [
//   { id: 1, nombre: "Metropolitana" },
//   { id: 2, nombre: "Valparaíso" }
// ]
// ======================================================================
export async function obtenerRegiones() {
  const res = await fetch(`${API_BASE}/api/v2/regiones`);

  if (!res.ok) throw new Error("Error cargando regiones");

  const data = await res.json();

  // Extraemos la lista HATEOAS
  const lista =
    data?._embedded?.regionResponseDTOList?.map(item => ({
      id: item.id,
      nombre: item.nombre
    })) || [];

  return lista;
}


// ======================================================================
// CREAR REGIÓN (POST)
// ======================================================================
export async function crearRegion(payload) {
  const res = await fetch(`${API_BASE}/api/regiones`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Error al crear región");
  return res.json();
}


// ======================================================================
// EDITAR REGIÓN (PUT)
// ======================================================================
export async function editarRegion(id, payload) {
  const res = await fetch(`${API_BASE}/api/regiones/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Error al editar región");
  return res.json();
}


// ======================================================================
// ELIMINAR REGIÓN
// ======================================================================
export async function eliminarRegion(id) {
  const res = await fetch(`${API_BASE}/api/regiones/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Error al eliminar región");
  return true;
}