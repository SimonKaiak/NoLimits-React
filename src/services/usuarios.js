// URL base de la API. Primero intenta tomarla desde las variables de entorno,
// y si no existe, usa directamente la URL del backend en Render.
const API_BASE =
  import.meta.env.VITE_API_URL ||
  "https://nolimits-backend-final.onrender.com";

// IDs de rol que se usan en el sistema. Sirven para saber si un usuario es admin o cliente.
export const ROL_ADMIN_ID = 2;
export const ROL_CLIENTE_ID = 1; // 1 = cliente normal

// ==========================================================
// LISTADO + BÚSQUEDA DE USUARIOS (por nombre o correo)
// ==========================================================
// Esta función trae usuarios desde el backend. Si no se pasa texto de búsqueda,
// lista todos. Si el texto tiene "@", asume que es búsqueda por correo.
// En caso contrario, busca por nombre.
export async function listarUsuarios(page = 1, search = "") {
  const trimmed = search.trim();

  let endpoint;
  if (!trimmed) {
    // Sin búsqueda: se usa el endpoint general.
    endpoint = `${API_BASE}/api/v1/usuarios`;
  } else if (trimmed.includes("@")) {
    // Si hay arroba, se considera búsqueda por correo.
    endpoint = `${API_BASE}/api/v1/usuarios/correo/${encodeURIComponent(
      trimmed
    )}`;
  } else {
    // Si no hay arroba, se considera búsqueda por nombre.
    endpoint = `${API_BASE}/api/v1/usuarios/nombre/${encodeURIComponent(
      trimmed
    )}`;
  }

  console.log("[listarUsuarios] endpoint:", endpoint);

  const res = await fetch(endpoint);

  // Si el backend responde 404 o 204, se interpreta como "sin resultados".
  if (res.status === 404 || res.status === 204) {
    console.warn("[listarUsuarios] Sin resultados para búsqueda");
    return {
      contenido: [],
      totalPaginas: 1,
    };
  }

  // Cualquier otro error que no sea OK se considera problema de carga.
  if (!res.ok) {
    const txt = await res.text();
    console.error("[listarUsuarios] Error HTTP:", res.status, txt);
    throw new Error("Error cargando usuarios");
  }

  const data = await res.json();
  console.log("[listarUsuarios] raw data:", data);

  // Normalizamos la respuesta: si viene un solo usuario, lo metemos en un arreglo.
  let contenido = [];
  if (Array.isArray(data)) {
    contenido = data;
  } else if (data) {
    contenido = [data];
  }

  // Por ahora no hay paginación real, así que siempre devolvemos 1 página.
  return {
    contenido,
    totalPaginas: 1,
  };
}

export async function listarUsuariosPaginado(page = 1, size = 4) {
  const url = `${API_BASE}/api/v1/usuarios/paginado?page=${page}&size=${size}`;
  console.log("[listarUsuariosPaginado] url:", url);

  const res = await fetch(url);

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    console.error("Error paginando usuarios:", res.status, txt);
    throw new Error("Error al cargar usuarios paginados");
  }

  return res.json();
}

// ==========================================================
// CRUD BÁSICO POR ID
// ==========================================================

// Obtiene un usuario por su ID desde el backend.
// Opción B: si el backend responde 404, lanzamos "USUARIO_NO_ENCONTRADO"
// para que el componente padre pueda mostrar un mensaje adecuado.
export async function obtenerUsuario(id) {
  const res = await fetch(`${API_BASE}/api/v1/usuarios/${id}`);
  const text = await res.text();

  if (res.status === 404) {
    console.warn("[obtenerUsuario] Usuario no encontrado:", id, text);
    // Este error es el que vas a capturar arriba:
    // if (err.message === "USUARIO_NO_ENCONTRADO") { ... }
    throw new Error("USUARIO_NO_ENCONTRADO");
  }

  if (!res.ok) {
    console.error("[obtenerUsuario] status:", res.status, text);
    throw new Error("Error obteniendo usuario");
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error("Respuesta inválida del servidor");
  }
}

// Crea un usuario nuevo con los datos enviados en "payload".
export async function crearUsuario(payload) {
  const res = await fetch(`${API_BASE}/api/v1/usuarios`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const text = await res.text();

  if (!res.ok) {
    // Intentamos leer el mensaje de error del backend.
    let error;
    try {
      error = JSON.parse(text);
    } catch {
      throw new Error(text || "Error al crear usuario");
    }
    throw new Error(error.message || "Error al crear usuario");
  }

  // Si el backend devuelve JSON, lo parseamos. Si no, devolvemos null.
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

// Edita parcialmente un usuario por ID usando PATCH.
export async function editarUsuario(id, payload) {
  const res = await fetch(`${API_BASE}/api/v1/usuarios/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const text = await res.text();

  if (!res.ok) {
    let error;
    try {
      error = JSON.parse(text);
    } catch {
      throw new Error(text || "Error al editar usuario");
    }
    throw new Error(error.message || "Error al editar usuario");
  }

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

// Elimina un usuario por ID.
export async function eliminarUsuario(id) {
  const res = await fetch(`${API_BASE}/api/v1/usuarios/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("[eliminarUsuario] status:", res.status, text);
    throw new Error("Error al eliminar usuario");
  }

  // Si llegó hasta aquí, se asume que el backend lo borró correctamente.
  return true;
}

// ==========================================================
// REGISTRO PÚBLICO DESDE /registro
// ==========================================================
// Esta función arma el payload de registro a partir de los campos del formulario
// y llama internamente a "crearUsuario".
export async function registrarUsuario(desdeFormulario) {
  // Limpia el teléfono para dejar solo números, y toma los últimos 9 dígitos.
  const telefonoLimpio = (desdeFormulario.telefono || "").replace(/\D/g, "");
  const telefonoNumero = Number(telefonoLimpio.slice(-9));

  const payload = {
    nombre: (desdeFormulario.nombre || "").trim(),
    apellidos: (desdeFormulario.apellidos || "").trim(),
    correo: (desdeFormulario.correo || "").trim(),
    telefono: telefonoNumero,
    password: (desdeFormulario.contrasena || "").trim(),
    // Siempre se registra como cliente normal.
    rol: { id: ROL_CLIENTE_ID },
  };

  console.log("[registrarUsuario] payload:", payload);
  return crearUsuario(payload);
}

// ==========================================================
// PERFIL (usa /me con sesión backend vía cookie)
// ==========================================================

// Obtiene el perfil del usuario actual usando la sesión del backend.
// La cookie de sesión se envía gracias a "credentials: include".
export async function obtenerMiPerfil() {
  const res = await fetch(`${API_BASE}/api/v1/usuarios/me`, {
    method: "GET",
    credentials: "include",
  });

  const text = await res.text();

  if (!res.ok) {
    console.error("[obtenerMiPerfil] status:", res.status, text);
    throw new Error("Debes iniciar sesión para ver tu perfil.");
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error("Respuesta inválida al obtener perfil");
  }
}

// Actualiza el perfil del usuario logueado.
// También usa la cookie de sesión para identificar al usuario en el backend.
export async function actualizarMiPerfil(payload) {
  const res = await fetch(`${API_BASE}/api/v1/usuarios/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const text = await res.text().catch(() => "");

  if (!res.ok) {
    console.error("[actualizarMiPerfil] status:", res.status, text);

    // Si la sesión caducó, devolvemos un error especial para poder manejarlo en el front.
    if (res.status === 401 || res.status === 403) {
      throw new Error("SESION_EXPIRADA");
    }

    throw new Error("ERROR_ACTUALIZAR");
  }

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

// Verifica si un correo ya está registrado.
// Si el backend responde 404, se considera que el correo no existe.
export const verificarCorreoRegistrado = async (correo) => {
  const url = `${API_BASE}/api/v1/usuarios/correo/${encodeURIComponent(
    correo
  )}`;

  const resp = await fetch(url);

  if (resp.status === 404) {
    // No se encontró usuario con ese correo.
    throw new Error("NOT_FOUND");
  }

  if (!resp.ok) {
    throw new Error("SERVER_ERROR");
  }

  return await resp.json();
};

// Cambia la contraseña del usuario actual usando la sesión.
export async function cambiarPassword(payload) {
  const res = await fetch(`${API_BASE}/api/v1/usuarios/me/password`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Error cambiando contraseña");
  return res.json();
}

// Obtiene las compras del usuario por su ID.
// El backend devuelve el listado de ventas asociadas a ese usuario.
export async function obtenerMisCompras(usuarioId) {
  const res = await fetch(
    `${API_BASE}/api/v1/usuarios/${usuarioId}/compras`,
    {
      credentials: "include",
    }
  );

  if (!res.ok) {
    throw new Error("Error obteniendo compras");
  }

  return res.json();
}

// ==========================================================
// LOGIN (usa sesión HTTP en backend via HttpSession)
// ==========================================================
// Realiza el inicio de sesión contra el backend. Si los datos son correctos,
// el backend crea una sesión y devuelve información básica del usuario.
export async function login(correo, password) {
  const res = await fetch(`${API_BASE}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // Esto permite que el backend cree y mantenga la sesión.
    body: JSON.stringify({ correo, password }),
  });

  const text = await res.text();

  if (!res.ok) {
    console.error("[login] status:", res.status, text);
    throw new Error("Login inválido");
  }

  let data = null;
  try {
    data = JSON.parse(text);
  } catch {
    // Si no se puede parsear, devolvemos null para indicar que no hay datos útiles.
    return null;
  }

  // De forma opcional, guardamos algunos datos en localStorage
  // si se necesitan para el comportamiento del frontend.
  if (data?.rolId) {
    localStorage.setItem("nl_rolId", String(data.rolId));
  }
  if (data?.id) {
    localStorage.setItem("nl_userId", String(data.id));
  }

  return data;
}