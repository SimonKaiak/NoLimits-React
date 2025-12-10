// Ruta: src/pages/admin/AdminUsuarioList.jsx
import React, { useState, useEffect } from "react";
import {
  obtenerUsuario,
  eliminarUsuario,
  listarUsuariosPaginado,
} from "../../services/usuarios";
import CrearUsuario from "../../components/organisms/CrearUsuario";
import "../../styles/adminBase.css";

export default function AdminUsuarioList() {
  const [busquedaId, setBusquedaId] = useState("");
  const [resultadoBusqueda, setResultadoBusqueda] = useState(null);
  const [error, setError] = useState("");
  const [usuarioEditando, setUsuarioEditando] = useState(null);

  const [compras, setCompras] = useState([]);
  const [loadingCompras, setLoadingCompras] = useState(false);
  const [errorCompras, setErrorCompras] = useState("");

  const [usuarios, setUsuarios] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [loadingLista, setLoadingLista] = useState(false);

  // 👇 NUEVO: controla qué vista se muestra
  // "listado" | "editar" | "compras"
  const [vista, setVista] = useState("listado");

  async function cargarUsuarios() {
    setLoadingLista(true);
    try {
      const data = await listarUsuariosPaginado(pagina, 4);
      setUsuarios(data.contenido || []);
      setTotalPaginas(data.totalPaginas || 1);
    } catch (e) {
      console.error(e);
    }
    setLoadingLista(false);
  }

  async function doBuscarPorId(id) {
    if (!id) return;
    setError("");
    setResultadoBusqueda(null);
    setUsuarioEditando(null);

    // Limpia compras al cambiar de usuario buscado
    setCompras([]);
    setErrorCompras("");
    setLoadingCompras(false);

    try {
      const u = await obtenerUsuario(id);
      setResultadoBusqueda(u);
    } catch (e) {
      console.error(e);
      if (e.message === "USUARIO_NO_ENCONTRADO") {
        setError(`No existe un usuario con ID ${id}.`);
      } else {
        setError("Error al buscar usuario. Inténtalo nuevamente.");
      }
    }
  }

  async function handleBuscarPorId(e) {
    e.preventDefault();
    await doBuscarPorId(busquedaId);
  }

  async function handleEliminar(id) {
    if (!window.confirm("¿Eliminar este usuario?")) return;
    try {
      await eliminarUsuario(id);
      setResultadoBusqueda(null);
      setUsuarioEditando(null);

      if (String(busquedaId) === String(id)) {
        setError(`El usuario con ID ${id} ha sido eliminado.`);
      }

      cargarUsuarios();
    } catch (e) {
      alert("Error al eliminar: " + e.message);
    }
  }

  // 👇 ahora también cambia la vista a "compras"
  async function handleVerCompras(usuarioId) {
    setVista("compras");
    setLoadingCompras(true);
    setErrorCompras("");
    setCompras([]);

    try {
      const base =
        import.meta.env.VITE_API_URL ||
        "https://nolimits-backend-final.onrender.com/api";

      const res = await fetch(`${base}/v1/usuarios/${usuarioId}/compras`);

      if (!res.ok) {
        throw new Error("Error al cargar compras del usuario");
      }

      const data = await res.json();
      const listaCompras = Array.isArray(data.compras) ? data.compras : [];

      setCompras(listaCompras);
    } catch (e) {
      console.error(e);
      setErrorCompras("Error al cargar las compras: " + e.message);
    } finally {
      setLoadingCompras(false);
    }
  }

  // 👇 al terminar edición, volvemos al listado
  function handleFinEdicion() {
    setUsuarioEditando(null);
    setVista("listado");
    if (busquedaId) {
      doBuscarPorId(busquedaId);
    } else {
      cargarUsuarios();
    }
  }

  // 👇 entrar a modo edición
  function handleEditar(usuario) {
    setUsuarioEditando(usuario);
    setVista("editar");
  }

  // 👇 botón "Volver"
  function handleVolver() {
    setVista("listado");
    setUsuarioEditando(null);
    setCompras([]);
    setErrorCompras("");
  }

  useEffect(() => {
    cargarUsuarios();
  }, [pagina]);

  return (
    <div className="admin-wrapper">
      <h2 className="admin-title">Administrar usuarios</h2>

      {/* ==================== VISTA LISTADO ==================== */}
      {vista === "listado" && (
        <>
          {loadingLista && <p className="admin-msg">Cargando usuarios...</p>}

          {!loadingLista && usuarios.length > 0 && (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre completo</th>
                  <th>Correo</th>
                  <th>Teléfono</th>
                  <th>Rol</th>
                </tr>
              </thead>

              <tbody>
                {usuarios.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>
                      {u.nombre} {u.apellidos}
                    </td>
                    <td>{u.correo}</td>
                    <td>{u.telefono}</td>
                    <td>{u.rolNombre ?? u.rol?.nombre}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Buscar por ID */}
          <form className="admin-form" onSubmit={handleBuscarPorId}>
            <input
              type="number"
              className="admin-input"
              value={busquedaId}
              onChange={(e) => setBusquedaId(e.target.value)}
              placeholder="Buscar usuario por ID"
            />
            <button type="submit" className="admin-btn">
              Buscar
            </button>
          </form>

          {error && (
            <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>
          )}

          {/* Resultado de la búsqueda */}
          {resultadoBusqueda && (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre completo</th>
                  <th>Correo</th>
                  <th>Teléfono</th>
                  <th>Rol</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{resultadoBusqueda.id}</td>
                  <td>
                    {resultadoBusqueda.nombre} {resultadoBusqueda.apellidos}
                  </td>
                  <td>{resultadoBusqueda.correo}</td>
                  <td>{resultadoBusqueda.telefono}</td>
                  <td>{resultadoBusqueda.rol?.nombre}</td>
                  <td>
                    <div className="admin-actions">
                      <button
                        type="button"
                        className="admin-action-btn admin-action-edit"
                        onClick={() => handleEditar(resultadoBusqueda)}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="admin-action-btn admin-action-delete"
                        onClick={() => handleEliminar(resultadoBusqueda.id)}
                      >
                        Eliminar
                      </button>
                      <button
                        type="button"
                        className="admin-action-btn admin-btn"
                        onClick={() => handleVerCompras(resultadoBusqueda.id)}
                      >
                        Ver compras
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          )}

          {/* PAGINACIÓN */}
          <div className="admin-pagination">
            <button
              className="admin-btn"
              disabled={pagina <= 1}
              onClick={() => setPagina((p) => p - 1)}
            >
              Anterior
            </button>

            <span>
              Página {pagina} / {totalPaginas}
            </span>

            <button
              className="admin-btn"
              disabled={pagina >= totalPaginas}
              onClick={() => setPagina((p) => p + 1)}
            >
              Siguiente
            </button>
          </div>
        </>
      )}
      
      {/* ==================== VISTA EDITAR ==================== */}
      {vista === "editar" && usuarioEditando && (
        <div style={{ marginTop: "25px" }}>
          <h3
            className="admin-title"
            style={{ fontSize: "22px", marginBottom: "15px" }}
          >
            Editar usuario
          </h3>

          <CrearUsuario
            modo="editar"
            usuarioInicial={usuarioEditando}
            onFinish={handleFinEdicion}
            onCancel={handleVolver}   // 👈 aquí mandamos Volver al form
          />
        </div>
      )}

      {/* ==================== VISTA COMPRAS ==================== */}
      {vista === "compras" && (
        <div style={{ marginTop: "25px" }}>
          {resultadoBusqueda && (
            <p style={{ marginBottom: "10px" }}>
              Compras de:{" "}
              <strong>
                {resultadoBusqueda.nombre} {resultadoBusqueda.apellidos}
              </strong>{" "}
              (ID: {resultadoBusqueda.id})
            </p>
          )}

          {loadingCompras && (
            <p className="admin-msg">Cargando compras...</p>
          )}

          {errorCompras && (
            <p style={{ color: "red" }}>{errorCompras}</p>
          )}

          {!loadingCompras && compras.length > 0 && (
            <>
              <h3 className="admin-title" style={{ fontSize: "20px" }}>
                Compras realizadas
              </h3>

              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID Venta</th>
                    <th>Fecha</th>
                    <th>Hora</th>
                    <th>Total</th>
                    <th>Método de pago</th>
                  </tr>
                </thead>
                <tbody>
                  {compras.map((venta) => (
                    <tr key={venta.id ?? venta.idVenta}>
                      <td>{venta.id ?? venta.idVenta}</td>
                      <td>{venta.fechaCompra}</td>
                      <td>{venta.horaCompra}</td>
                      <td>${venta.totalVenta}</td>
                      <td>
                        {venta.metodoPagoModel?.nombre ||
                          venta.metodoPago?.nombre}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {!loadingCompras &&
            compras.length === 0 &&
            !errorCompras && (
              <p className="admin-msg">
                Este usuario no registra compras.
              </p>
            )}

          {/* 👇 Volver abajo en compras */}
          <div className="admin-form-actions" style={{ marginTop: "15px" }}>
            <button
              type="button"
              className="admin-btn-secondary"
              onClick={handleVolver}
            >
              ← Volver
            </button>
          </div>
        </div>
      )}
    </div>
  );
}