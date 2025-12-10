// ======================================================================
// Servicio: tiposDesarrollador.js
// Maneja todo lo relacionado con "Tipos de Desarrollador".
// Estos tipos son categorías como:
//   - Frontend
//   - Backend
//   - FullStack
// etc.
//
// Cada función de este archivo se comunica con el backend usando fetch.
// ======================================================================



// ----------------------------------------------------------------------
// API_BASE:
// ----------------------------------------------------------------------
const API_BASE =
  import.meta.env.VITE_API_URL ||
  "https://nolimits-backend-final.onrender.com";


// ----------------------------------------------------------------------
// API_URL:
// ----------------------------------------------------------------------
const API_URL = `${API_BASE}/api/tipos-desarrollador`;



/* ======================================================================
   LISTAR TIPOS DE DESARROLLADOR
   GET /api/tipos-desarrollador

   Esta función trae TODOS los tipos registrados en el backend.

   Parámetros:
   - pagina: no usado actualmente (el backend no pagina)
   - busqueda: texto para filtrar por nombre pero en el frontend

   Funcionamiento:
   1. Pide la lista completa al backend.
   2. Si no hay búsqueda, devuelve toda la lista.
   3. Si hay búsqueda, filtra por nombre desde el frontend.
   ====================================================================== */
export async function listarTiposDesarrollador(pagina, busqueda = "") {
  
  const endpoint = `${API_BASE}/api/tipos-desarrollador/paginado?page=${pagina}&size=4`;

  const res = await fetch(endpoint);

  if (!res.ok) {
    console.error("Error listar tipos desarrollador:", res.status);
    throw new Error("Error al listar tipos de desarrollador");
  }

  const data = await res.json();

  // Filtrar en frontend si hay búsqueda
  if (busqueda.trim().length > 0) {
    const needle = busqueda.toLowerCase();
    data.contenido = data.contenido.filter((t) =>
      (t.nombre || "").toLowerCase().includes(needle)
    );
  }

  return data; 
}



/* ======================================================================
   OBTENER TIPO POR ID
   GET /api/tipos-desarrollador/{id}

   Devuelve la información de un tipo de desarrollador específico.
   Se usa en pantallas como Editar Tipo.
   ====================================================================== */
export async function obtenerTipoDesarrollador(id) {
  const res = await fetch(`${API_URL}/${id}`);

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    console.error("Error obtener tipo desarrollador:", res.status, txt);
    throw new Error("Error al obtener tipo de desarrollador");
  }

  return await res.json();
}



/* ======================================================================
   CREAR TIPO DE DESARROLLADOR
   POST /api/tipos-desarrollador

   data es un objeto con la información a crear, ejemplo:
     { nombre: "Backend" }

   Si el servidor responde con error, se lanza una excepción.
   ====================================================================== */
export async function crearTipoDesarrollador(data) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    console.error("Error crear tipo desarrollador:", res.status, txt);
    throw new Error("Error al crear tipo de desarrollador");
  }

  return await res.json();
}



/* ======================================================================
   ACTUALIZAR TIPO COMPLETO (PUT)
   PUT /api/tipos-desarrollador/{id}

   Reemplaza todo el objeto del tipo de desarrollador.
   data es el nuevo objeto completo.
   ====================================================================== */
export async function actualizarTipoDesarrollador(id, data) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    console.error("Error actualizar tipo desarrollador:", res.status, txt);
    throw new Error("Error al actualizar tipo de desarrollador");
  }

  return await res.json();
}



/* ======================================================================
   ELIMINAR TIPO
   DELETE /api/tipos-desarrollador/{id}

   Elimina un tipo de desarrollador por su ID.
   Si falla, lanza un error.
   ====================================================================== */
export async function eliminarTipoDesarrollador(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    console.error("Error eliminar tipo desarrollador:", res.status, txt);
    throw new Error("Error al eliminar tipo de desarrollador");
  }
}