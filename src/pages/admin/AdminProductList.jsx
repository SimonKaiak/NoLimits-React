import React, { useState, useEffect } from "react";
import {
  obtenerProducto,
  eliminarProducto,
  listarProductosPaginado,
} from "../../services/productos";
import CrearProducto from "../../components/organisms/CrearProducto";
import "../../styles/adminProductos.css";

export default function AdminProductList() {
  const [busquedaId, setBusquedaId] = useState("");
  const [resultadoBusqueda, setResultadoBusqueda] = useState(null);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");           // ✅ mensaje de éxito
  const [productoEditando, setProductoEditando] = useState(null);
  const [productos, setProductos] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [mostrarCrear, setMostrarCrear] = useState(false);

  // ------------ helper para recargar la página actual de productos ------------
  async function cargarPagina(p = page) {
    try {
      const data = await listarProductosPaginado(p, 3);
      console.log("PAGINADO PRODUCTOS ->", data);
      const lista = data?.content || data?.contenido || [];
      setProductos(lista);
      setTotalPages(data?.totalPages || 1);
    } catch (err) {
      console.error(err);
      setProductos([]);
      setTotalPages(1);
    }
  }

  async function buscarPorId(id) {
    setError("");
    setResultadoBusqueda(null);
    setProductoEditando(null);
    if (!id) return;

    try {
      const prod = await obtenerProducto(id);
      setResultadoBusqueda(prod);
    } catch (e) {
      console.error(e);
      setError("No se encontró el producto: " + e.message);
    }
  }

  async function handleBuscarPorId(e) {
    e.preventDefault();
    await buscarPorId(busquedaId);
  }

  async function handleEliminar(id) {
    if (!window.confirm("¿Eliminar este producto?")) return;

    try {
      await eliminarProducto(id);
      setResultadoBusqueda(null);
      setProductoEditando(null);
      await cargarPagina(page);                  // refresca listado
      setMensaje("Producto eliminado correctamente.");
      limpiarMensaje();
    } catch (e) {
      alert("Error al eliminar: " + e.message);
    }
  }

  // cuando termina una edición
  async function handleFinEdicion() {
    setProductoEditando(null);
    if (busquedaId) {
      await buscarPorId(busquedaId);
    }
    await cargarPagina(page);
    setMensaje("Producto actualizado correctamente.");
    limpiarMensaje();
  }

  // cuando termina una creación
  async function handleFinCreacion() {
    setMostrarCrear(false);          // cierra formulario
    setBusquedaId("");              // limpia el buscador (opcional)
    setResultadoBusqueda(null);
    await cargarPagina(1);          // recarga tabla (puedes dejar page si prefieres)
    setPage(1);

    setMensaje("Producto creado correctamente.");
    limpiarMensaje();
  }

  // borra el mensaje después de unos segundos
  function limpiarMensaje() {
    setTimeout(() => setMensaje(""), 4000);
  }

  useEffect(() => {
    cargarPagina(page);
  }, [page]);

    return (
    <div className="admin-products-page">

      {/* 🔹 Mostrar búsqueda y resultados SOLO si NO estoy editando ni creando */}
      {!productoEditando && !mostrarCrear && (
        <>
          {/* ------------------------ TARJETA: BUSCAR POR ID ------------------------ */}
          <div className="admin-products-card">
            <h2 className="admin-products-title">Productos</h2>

            <form className="admin-products-search" onSubmit={handleBuscarPorId}>
              <input
                type="number"
                className="admin-products-input"
                value={busquedaId}
                onChange={(e) => setBusquedaId(e.target.value)}
                placeholder="Buscar producto por ID"
              />
              <button type="submit" className="btn-nl">Buscar</button>
            </form>

            {error && <p className="admin-products-error">{error}</p>}
            {mensaje && <p className="admin-products-success">{mensaje}</p>}

            {resultadoBusqueda && (
              <div className="admin-products-result">
                <div className="admin-products-table-wrap">
                  <table className="admin-products-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Precio</th>
                        <th>Tipo</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>

                    <tbody>
                      <tr>
                        <td>{resultadoBusqueda.id}</td>
                        <td>{resultadoBusqueda.nombre}</td>
                        <td>${resultadoBusqueda.precio}</td>
                        <td>{resultadoBusqueda.tipoProductoNombre}</td>
                        <td>{resultadoBusqueda.estadoNombre}</td>
                        <td>
                          <div className="admin-products-actions">
                            <button
                              type="button"
                              className="btn-nl btn-nl-secondary"
                              onClick={() => setProductoEditando(resultadoBusqueda)}
                            >
                              Editar
                            </button>
                            <button
                              type="button"
                              className="btn-nl btn-nl-danger"
                              onClick={() => handleEliminar(resultadoBusqueda.id)}
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* ------------------------ LISTADO PAGINADO ------------------------ */}
          <div className="admin-products-card">
            <h2 className="admin-products-title">Listado de Productos</h2>
            {mensaje && <p className="admin-products-success">{mensaje}</p>}
            
            <div className="admin-products-table-wrap">
              <table className="admin-products-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Tipo</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.length === 0 && (
                    <tr>
                      <td colSpan="5" style={{ textAlign: "center" }}>
                        No hay productos registrados
                      </td>
                    </tr>
                  )}

                  {productos.map((prod) => (
                    <tr key={prod.id}>
                      <td>{prod.id}</td>
                      <td>{prod.nombre}</td>
                      <td>${prod.precio}</td>
                      <td>{prod.tipoProductoNombre}</td>
                      <td>{prod.estadoNombre}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="paginacion">
              <button
                className="btn-nl"
                disabled={page === 1}
                onClick={() => setPage((prev) => prev - 1)}
              >
                Anterior
              </button>

              <span>Página {page} de {totalPages}</span>

              <button
                className="btn-nl"
                disabled={page >= totalPages}
                onClick={() => setPage((prev) => prev + 1)}
              >
                Siguiente
              </button>
            </div>

            <div className="admin-products-create-wrapper">
              <div className="admin-products-create-block">
                <button
                  type="button"
                  className="btn-nl btn-nl-secondary"
                  onClick={() => setMostrarCrear(true)}
                >
                  Crear
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ------------------------ TARJETA CREAR ------------------------ */}
      {mostrarCrear && (
        <div className="admin-products-card">
          <CrearProducto modo="crear" onFinish={handleFinCreacion} />
          <button
            type="button"
            className="btn-nl btn-nl-secondary admin-products-cancel"
            onClick={() => setMostrarCrear(false)}
          >
            Cancelar creación
          </button>
        </div>
      )}

      {/* ------------------------ TARJETA EDITAR ------------------------ */}
      {productoEditando && (
        <div className="admin-products-card">
          <CrearProducto
            modo="editar"
            productoInicial={productoEditando}
            onFinish={handleFinEdicion}
          />
          <button
            type="button"
            className="btn-nl btn-nl-secondary admin-products-cancel"
            onClick={() => setProductoEditando(null)}
          >
            Cancelar edición
          </button>
        </div>
      )}
    </div>
  );
}