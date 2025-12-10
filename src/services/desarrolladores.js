// ============================================================
// Servicio: desarrolladores.js
// Funciones CRUD para la entidad "Desarrollador"
// Usadas en el módulo de Catálogos del Administrador
// ============================================================

// API_BASE define la URL base del backend.
const API_BASE =
  import.meta.env.VITE_API_URL ||
  "https://nolimits-backend-final.onrender.com/api/v1";


// ===================================================================
// LISTAR desarrolladores (con filtro por nombre)
// -------------------------------------------------------------------
// - page: actualmente ignorado porque el backend NO maneja paginación.
// - search: texto opcional para filtrar por nombre.
//
// El backend retorna una lista simple. Nosotros la "normalizamos"
// al formato { contenido: [...], totalPaginas: 1 }
// para que combine con el comportamiento del resto de los catálogos.
// ===================================================================
export async function listarDesarrolladores(page = 1, search = "") {

  const params = new URLSearchParams();
  params.append("page", page);
  params.append("size", 4);
  params.append("search", search);

  const res = await fetch(`${API_BASE}/desarrolladores/paginado?${params.toString()}`);

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    console.error("[listarDesarrolladores] Error HTTP:", res.status, txt);
    throw new Error("Error cargando desarrolladores");
  }

  const data = await res.json();
  console.log("[listarDesarrolladores] data:", data);

  return {
    contenido: data.contenido || [],
    totalPaginas: data.totalPaginas || 1,
    pagina: data.pagina || page,
    totalElementos: data.totalElementos || 0
  };
}


// ===================================================================
// CREAR desarrollador (POST)
// payload: { nombre: "...", tipoDesarrollador: { id: X }, activo: true }
// ===================================================================
export async function crearDesarrollador(payload) {

  const res = await fetch(`${API_BASE}/desarrolladores`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  // Manejo de errores del backend
  if (!res.ok) {
    let error;
    try {
      error = await res.json(); // backend suele enviar {message: ""}
    } catch {
      throw new Error("Error al crear desarrollador");
    }
    throw new Error(error.message || "Error al crear desarrollador");
  }

  return res.json(); // retorna el desarrollador creado
}


// ===================================================================
// EDITAR desarrollador (PUT)
// ===================================================================
export async function editarDesarrollador(id, payload) {

  const res = await fetch(`${API_BASE}/desarrolladores/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  // Manejo de errores
  if (!res.ok) {
    let error;
    try {
      error = await res.json();
    } catch {
      throw new Error("Error al editar desarrollador");
    }
    throw new Error(error.message || "Error al editar desarrollador");
  }

  return res.json(); // retorna el desarrollador actualizado
}


// ===================================================================
// PATCH desarrollador (actualización parcial)
// ===================================================================
export async function patchDesarrollador(id, payload) {

  const res = await fetch(`${API_BASE}/desarrolladores/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Error al actualizar desarrollador");

  return res.json();
}


// ===================================================================
// ELIMINAR desarrollador (DELETE)
// ===================================================================
export async function eliminarDesarrollador(id) {

  const res = await fetch(`${API_BASE}/desarrolladores/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Error al eliminar desarrollador");

  return true; // confirmación
}


// ===================================================================
// OBTENER desarrollador por ID (GET /:id)
// ===================================================================
export async function obtenerDesarrollador(id) {

  const res = await fetch(`${API_BASE}/desarrolladores/${id}`);

  if (!res.ok) throw new Error("Error al obtener desarrollador");

  return res.json(); // retornamos los datos completos del desarrollador
}