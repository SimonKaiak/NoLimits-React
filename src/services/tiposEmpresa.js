// ======================================================================
// Servicio: tiposEmpresa.js
// Maneja todo lo relacionado con "Tipos de Empresa".
// Ejemplos de tipos: Comercial, Editorial, Distribuidora, etc.
//
// Todas estas funciones se comunican con el backend usando fetch.
// ======================================================================



// ----------------------------------------------------------------------
// API_BASE:
// ----------------------------------------------------------------------
const API_BASE =
  import.meta.env.VITE_API_URL ||
  "https://nolimits-backend-final.onrender.com";


// ----------------------------------------------------------------------
// API_URL:
// Ruta base para todos los endpoints de tipos de empresa.
// ----------------------------------------------------------------------
const API_URL = `${API_BASE}/api/v1/tipos-empresa`;



/* ======================================================================
   LISTAR TIPOS DE EMPRESA
   GET /api/v1/tipos-empresa

   Parámetros:
     - pagina: actualmente no se usa porque el backend no pagina.
     - busqueda: texto para filtrar por nombre pero desde el front.

   Funcionamiento:
     1. Trae todo desde el backend.
     2. Si no hay búsqueda, devuelve la lista tal cual.
     3. Si hay búsqueda, filtra en memoria por coincidencia en el nombre.
   ====================================================================== */
export async function listarTiposEmpresa(pagina, busqueda = "") {

  const size = 4; // tamaño de página estándar del proyecto

  // URL con parámetros de paginación
  let url = `${API_URL}?page=${pagina}&size=${size}`;

  const res = await fetch(url);

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    console.error("Error listar tipos empresa:", res.status, txt);
    throw new Error("Error al listar tipos de empresa");
  }

  const data = await res.json(); // <- viene un PagedResponse

  // Si no hay búsqueda, devolvemos la respuesta tal como viene del backend
  if (!busqueda || !busqueda.trim()) {
    return data;
  }

  // FILTRAR EN EL FRONT (solo sobre la página actual)
  const needle = busqueda.trim().toLowerCase();
  const filtrado = data.contenido.filter((item) =>
    (item.nombre || "").toLowerCase().includes(needle)
  );

  return {
    ...data,
    contenido: filtrado
  };
}



/* ======================================================================
   OBTENER TIPO DE EMPRESA POR ID
   GET /api/v1/tipos-empresa/{id}

   Devuelve la información completa para un tipo de empresa específico.
   Se usa en pantallas como "Editar Tipo de Empresa".
   ====================================================================== */
export async function obtenerTipoEmpresa(id) {
  const res = await fetch(`${API_URL}/${id}`);

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    console.error("Error obtener tipo empresa:", res.status, txt);
    throw new Error("Error al obtener tipo de empresa");
  }

  return await res.json();
}



/* ======================================================================
   CREAR TIPO DE EMPRESA
   POST /api/v1/tipos-empresa

   payload debe ser un objeto, por ejemplo:
     { nombre: "Editorial" }

   Si el servidor responde con error, lanzamos un mensaje.
   ====================================================================== */
export async function crearTipoEmpresa(payload) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    console.error("Error crear tipo empresa:", res.status, txt);
    throw new Error("Error al crear tipo de empresa");
  }

  return await res.json();
}



/* ======================================================================
   ACTUALIZAR COMPLETAMENTE (PUT)
   PUT /api/v1/tipos-empresa/{id}

   Reemplaza todos los campos del tipo de empresa con los nuevos del payload.
   ====================================================================== */
export async function actualizarTipoEmpresa(id, payload) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    console.error("Error actualizar tipo empresa:", res.status, txt);
    throw new Error("Error al actualizar tipo de empresa");
  }

  return await res.json();
}



/* ======================================================================
   ELIMINAR TIPO DE EMPRESA
   DELETE /api/v1/tipos-empresa/{id}

   Elimina el tipo de empresa según su ID.
   Si algo falla, lanzamos un error.
   ====================================================================== */
export async function eliminarTipoEmpresa(id) {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    console.error("Error eliminar tipo empresa:", res.status, txt);
    throw new Error("Error al eliminar tipo de empresa");
  }
}