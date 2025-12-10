// ======================================================================
// Servicio: tiposProducto.js
// Maneja todas las operaciones CRUD relacionadas con "Tipo de Producto".
// Ejemplos: Películas, Videojuegos, Accesorios, Libros, etc.
//
// Todos los métodos usan fetch() y siguen la estructura general del backend.
// ======================================================================



// ----------------------------------------------------------------------
// API_BASE:
// ----------------------------------------------------------------------
const API_BASE =
  import.meta.env.VITE_API_URL ||
  "https://nolimits-backend-final.onrender.com";


// ----------------------------------------------------------------------
// API_URL:
// Ruta base para todos los endpoints del recurso "tipo-productos".
// ----------------------------------------------------------------------
const API_URL = `${API_BASE}/api/v1/tipo-productos`;

/* ======================================================================
   LISTAR TIPOS DE PRODUCTO
   GET  /api/v1/tipo-productos
   GET  /api/v1/tipo-productos/buscar?nombre={texto}

   Parámetros:
     - page (actualmente ignorado, backend no pagina)
     - search -> texto para buscar por nombre

   Lógica:
      Si viene texto, usamos endpoint /buscar.
      Si no, traemos todos los tipos de producto.

   Devuelve: lista JSON.
   ====================================================================== */
export async function listarTiposProducto(page = 1, search = "") {

  const url = `${API_URL}/paginado?page=${page}&size=4&search=${encodeURIComponent(
    search
  )}`;

  const res = await fetch(url);

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    console.error("Error cargando tipos de productos:", res.status, txt);
    throw new Error("Error cargando tipos de productos");
  }

  return await res.json(); // devuelve: { contenido, pagina, totalPaginas, totalElementos }
}

/* ======================================================================
   CREAR TIPO DE PRODUCTO
   POST  /api/v1/tipo-productos

   payload debe tener el formato:
     { nombre: "Videojuegos" }

   Si algo falla, lanzamos error con el texto del backend.
   ====================================================================== */
export async function crearTipoProducto(payload) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    console.error("Error al crear tipo de producto:", res.status, txt);
    throw new Error("Error al crear tipo de producto");
  }

  return res.json();
}

/* ======================================================================
   EDITAR (PUT)
   PUT  /api/v1/tipo-productos/{id}

   Reemplaza todos los datos del tipo de producto con el contenido del payload.
   Es una actualización completa.
   ====================================================================== */
export async function editarTipoProducto(id, payload) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    console.error("Error al editar tipo de producto:", res.status, txt);
    throw new Error("Error al editar tipo de producto");
  }

  return res.json();
}

/* ======================================================================
   PATCH (ACTUALIZACIÓN PARCIAL)
   PATCH  /api/v1/tipo-productos/{id}

   Solo actualiza los campos enviados en payloadParcial.
   Ideal para cambios pequeños como renombrar.
   ====================================================================== */
export async function patchTipoProducto(id, payloadParcial) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payloadParcial),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    console.error("Error en patch tipo producto:", res.status, txt);
    throw new Error("Error en patch tipo producto");
  }

  return res.json();
}

/* ======================================================================
   ELIMINAR
   DELETE  /api/v1/tipo-productos/{id}

   Elimina el tipo de producto.
   Devuelve true si fue exitoso.
   ====================================================================== */
export async function eliminarTipoProducto(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    console.error("Error al eliminar tipo de producto:", res.status, txt);
    throw new Error("Error al eliminar");
  }

  return true;
}

/* ======================================================================
   OBTENER POR ID
   GET  /api/v1/tipo-productos/{id}

   Permite cargar un tipo de producto específico,
   por ejemplo para editarlo.
   ====================================================================== */
export async function obtenerTipoProducto(id) {
  const res = await fetch(`${API_URL}/${id}`);

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    console.error("Error al obtener tipo de producto:", res.status, txt);
    throw new Error("Error al obtener tipo de producto");
  }

  return res.json();
}