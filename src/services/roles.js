// ======================================================================
// Servicio: roles.js
// Su trabajo es comunicarse con el backend para manejar roles de usuario.
// Un "rol" es un permiso o categoría, como Administrador, Cliente, etc.
// ======================================================================


// ----------------------------------------------------------------------
// API_URL
// ----------------------------------------------------------------------
const API_URL = "";



// ======================================================================
// LISTAR ROLES (con paginación y búsqueda)
// GET  /roles?page=X&search=texto
//
// Esta función obtiene una lista de roles desde el backend.
// Es útil para pantallas grandes como el Administrador de Roles.
//
// page  número de página
// search  texto para filtrar por nombre
// ======================================================================
export async function listarRoles(page = 1, search = "") {
    const res = await fetch(
        `${API_URL}/roles?page=${page}&search=${encodeURIComponent(search)}`
    );

    if (!res.ok) throw new Error("Error cargando roles");
    return res.json();
}



// ======================================================================
// CREAR ROL
// POST  /roles
//
// payload es un objeto con los datos del nuevo rol, por ejemplo:
//   { nombre: "Administrador" }
//
// Si el servidor responde con error, lo mostramos de manera clara.
// ======================================================================
export async function crearRole(payload) {
    const res = await fetch(`${API_URL}/roles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    if (!res.ok) {
        const error = await res.json().catch(() => null);
        throw new Error(error?.message || "Error al crear rol");
    }

    return res.json();
}



// ======================================================================
// EDITAR ROL COMPLETO (PUT)
// PUT /roles/{id}
//
// Se envía un objeto completo y se reemplaza el contenido original.
// ======================================================================
export async function editarRole(id, payload) {
    const res = await fetch(`${API_URL}/roles/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    if (!res.ok) {
        const error = await res.json().catch(() => null);
        throw new Error(error?.message || "Error al editar rol");
    }

    return res.json();
}



// ======================================================================
// EDITAR PARCIAL (PATCH)
// PATCH /roles/{id}
//
// Patch sirve para modificar solo una parte del rol.
// Por ejemplo solo cambiar el nombre sin tocar el resto.
// ======================================================================
export async function patchRole(id, payloadParcial) {
    const res = await fetch(`${API_URL}/roles/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payloadParcial)
    });

    if (!res.ok) throw new Error("Error en PATCH rol");
    return res.json();
}



// ======================================================================
// ELIMINAR UN ROL
// DELETE /roles/{id}
//
// Si el servidor responde con estatus de error, avisamos.
// Si todo sale bien, devolvemos true.
// ======================================================================
export async function eliminarRole(id) {
    const res = await fetch(`${API_URL}/roles/${id}`, {
        method: "DELETE"
    });

    if (!res.ok) throw new Error("Error al eliminar rol");
    return true;
}



// ======================================================================
// OBTENER UN ROL POR ID
// GET /roles/{id}
//
// Devuelve la información completa de un rol específico.
// ======================================================================
export async function obtenerRole(id) {
    const res = await fetch(`${API_URL}/roles/${id}`);

    if (!res.ok) throw new Error("Error al obtener rol");
    return res.json();
}



/* =====================================================================
   fetchRoles()

   Obtiene todos los roles sin paginación ni estructura compleja.

   Explicación clara:
   listarRoles() devuelve datos paginados (incluye página, total, etc.)
   pero para un formulario de selección (un <select>) necesitamos
   solamente la lista simple.

   Por eso fetchRoles() hace una petición simple a:
      GET /roles

   y devuelve solo la lista sin paginar.
   ===================================================================== */
export async function fetchRoles() {
    const res = await fetch(`${API_URL}/roles`);

    if (!res.ok) {
        throw new Error("Error al obtener lista de roles");
    }

    return res.json();
}
