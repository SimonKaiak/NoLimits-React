// Ruta: src/services/usuarios.js

// URL base de la API. Primero intenta tomarla desde las variables de entorno,
// y si no existe, usa directamente la URL del backend en Render.
const API_BASE =
  import.meta.env.VITE_API_URL ||
  "https://nolimits-backend-final.onrender.com";

// IDs de rol que se usan en el sistema. Sirven para saber si un usuario es admin o cliente.
export const ROL_ADMIN_ID = 2;
export const ROL_CLIENTE_ID = 1; // 1 = cliente normal

// ==========================================================
// Helpers de Auth (JWT)
// ==========================================================
function getToken() {
  return typeof window !== "undefined" ? localStorage.getItem("nl_token") : null;
}

function authHeaders(extra = {}) {
  const token = getToken();
  return {
    ...extra,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// ==========================================================
// LISTADO + BÚSQUEDA DE USUARIOS (por nombre o correo)
// ==========================================================
export async function listarUsuarios(page = 1, search = "") {
  const trimmed = search.trim();

  let endpoint;
  if (!trimmed) {
    endpoint = `${API_BASE}/api/v1/usuarios`;
  } else if (trimmed.includes("@")) {
    endpoint = `${API_BASE}/api/v1/usuarios/correo/${encodeURIComponent(trimmed)}`;
  } else {
    endpoint = `${API_BASE}/api/v1/usuarios/nombre/${encodeURIComponent(trimmed)}`;
  }

  console.log("[listarUsuarios] endpoint:", endpoint);

  const res = await fetch(endpoint, {
    headers: authHeaders(),
  });

  if (res.status === 404 || res.status === 204) {
    console.warn("[listarUsuarios] Sin resultados para búsqueda");
    return { contenido: [], totalPaginas: 1 };
  }

  if (!res.ok) {
    const txt = await res.text();
    console.error("[listarUsuarios] Error HTTP:", res.status, txt);
    throw new Error("Error cargando usuarios");
  }

  const data = await res.json();
  console.log("[listarUsuarios] raw data:", data);

  let contenido = [];
  if (Array.isArray(data)) contenido = data;
  else if (data) contenido = [data];

  return { contenido, totalPaginas: 1 };
}

export async function listarUsuariosPaginado(page = 1, size = 4) {
  const url = `${API_BASE}/api/v1/usuarios/paginado?page=${page}&size=${size}`;
  console.log("[listarUsuariosPaginado] url:", url);

  const res = await fetch(url, {
    headers: authHeaders(),
  });

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
export async function obtenerUsuario(id) {
  const res = await fetch(`${API_BASE}/api/v1/usuarios/${id}`, {
    headers: authHeaders(),
  });

  const text = await res.text();

  if (res.status === 404) {
    console.warn("[obtenerUsuario] Usuario no encontrado:", id, text);
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

export async function crearUsuario(payload) {
  const res = await fetch(`${API_BASE}/api/v1/usuarios`, {
    method: "POST",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(payload),
  });

  const text = await res.text();

  if (!res.ok) {
    let error;
    try {
      error = JSON.parse(text);
    } catch {
      throw new Error(text || "Error al crear usuario");
    }
    throw new Error(error.message || "Error al crear usuario");
  }

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export async function editarUsuario(id, payload) {
  const res = await fetch(`${API_BASE}/api/v1/usuarios/${id}`, {
    method: "PATCH",
    headers: authHeaders({ "Content-Type": "application/json" }),
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

export async function eliminarUsuario(id) {
  const res = await fetch(`${API_BASE}/api/v1/usuarios/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("[eliminarUsuario] status:", res.status, text);
    throw new Error("Error al eliminar usuario");
  }

  return true;
}

// ==========================================================
// REGISTRO PÚBLICO DESDE /registro
// ==========================================================
export async function registrarUsuario(desdeFormulario) {
  const telefonoLimpio = (desdeFormulario.telefono || "").replace(/\D/g, "");
  const telefonoNumero = Number(telefonoLimpio.slice(-9));

  const payload = {
    nombre: (desdeFormulario.nombre || "").trim(),
    apellidos: (desdeFormulario.apellidos || "").trim(),
    correo: (desdeFormulario.correo || "").trim().toLowerCase(),
    telefono: telefonoNumero,
    password: (desdeFormulario.contrasena || "").trim(),
    rolId: ROL_CLIENTE_ID,
  };

  console.log("[registrarUsuario] payload:", payload);
  return crearUsuario(payload);
}

// ==========================================================
// PERFIL
// ==========================================================
// OJO: si tu backend ya migró a JWT, NO necesitas credentials include.
// Lo dejo activado, pero con Authorization igualmente.
export async function obtenerMiPerfil() {
  const res = await fetch(`${API_BASE}/api/v1/usuarios/me`, {
    method: "GET",
    credentials: "include",
    headers: authHeaders(),
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

export async function actualizarMiPerfil(payload) {
  const res = await fetch(`${API_BASE}/api/v1/usuarios/me`, {
    method: "PATCH",
    headers: authHeaders({ "Content-Type": "application/json" }),
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const text = await res.text().catch(() => "");

  if (!res.ok) {
    console.error("[actualizarMiPerfil] status:", res.status, text);
    if (res.status === 401 || res.status === 403) throw new Error("SESION_EXPIRADA");
    throw new Error("ERROR_ACTUALIZAR");
  }

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export const verificarCorreoRegistrado = async (correo) => {
  const url = `${API_BASE}/api/v1/usuarios/correo/${encodeURIComponent(correo)}`;

  const resp = await fetch(url, {
    headers: authHeaders(),
  });

  if (resp.status === 404) throw new Error("NOT_FOUND");
  if (!resp.ok) throw new Error("SERVER_ERROR");

  return await resp.json();
};

export async function cambiarPassword(payload) {
  const res = await fetch(`${API_BASE}/api/v1/usuarios/me/password`, {
    method: "PATCH",
    headers: authHeaders({ "Content-Type": "application/json" }),
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Error cambiando contraseña");
  return res.json();
}

export async function obtenerMisCompras(usuarioId) {
  const res = await fetch(`${API_BASE}/api/v1/usuarios/${usuarioId}/compras`, {
    credentials: "include",
    headers: authHeaders(),
  });

  if (!res.ok) throw new Error("Error obteniendo compras");
  return res.json();
}

// ==========================================================
// LOGIN
// ==========================================================
export async function login(correo, password) {
  const res = await fetch(`${API_BASE}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
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
    return null;
  }

  if (data?.rolId) localStorage.setItem("nl_rolId", String(data.rolId));
  if (data?.id) localStorage.setItem("nl_userId", String(data.id));

  return data;
}