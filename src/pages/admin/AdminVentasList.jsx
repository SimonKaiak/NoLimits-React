import React, { useEffect, useState } from "react";
import { listarVentasPaginado, obtenerVenta } from "../../services/ventas";
import "../../styles/adminBase.css";

export default function AdminVentaList() {
  const [ventas, setVentas] = useState([]);
  const [ventaExpandida, setVentaExpandida] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  // --- BÚSQUEDA POR ID ---
  const [busquedaId, setBusquedaId] = useState("");
  const [resultadoBusqueda, setResultadoBusqueda] = useState(null);
  const [loadingBusqueda, setLoadingBusqueda] = useState(false);
  const [errorBusqueda, setErrorBusqueda] = useState("");

  async function cargarVentas() {
    setLoading(true);
    setError("");

    try {
      const data = await listarVentasPaginado(pagina, 4);
      setVentas(data.contenido || []);
      setTotalPaginas(data.totalPaginas || 1);
    } catch (err) {
      console.error(err);
      setError("❌ Error al cargar ventas");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargarVentas();
  }, [pagina]);

  async function handleBuscarVenta(e) {
    e.preventDefault?.();

    setErrorBusqueda("");
    setResultadoBusqueda(null);

    const idNumber = Number(busquedaId);

    if (!busquedaId || isNaN(idNumber) || idNumber <= 0) {
      setErrorBusqueda("Ingresa un ID de venta válido.");
      return;
    }

    try {
      setLoadingBusqueda(true);
      const venta = await obtenerVenta(idNumber);
      setResultadoBusqueda(venta);
    } catch (err) {
      console.error(err);
      setErrorBusqueda("No se encontró una venta con ese ID.");
    } finally {
      setLoadingBusqueda(false);
    }
  }

  function handleLimpiarBusqueda() {
    setBusquedaId("");
    setResultadoBusqueda(null);
    setErrorBusqueda("");
  }

  return (
    <div className="admin-wrapper ventas-wrapper">
      <h2 className="admin-title">Ventas</h2>

      {/* ========== BUSCADOR POR ID ========== */}
      <form className="admin-form" onSubmit={handleBuscarVenta}>
        <input
          type="number"
          min="1"
          className="admin-input"
          placeholder="Buscar venta por ID..."
          value={busquedaId}
          onChange={(e) => setBusquedaId(e.target.value)}
        />

        <button type="submit" className="admin-btn">
          {loadingBusqueda ? "Buscando..." : "Buscar"}
        </button>

        {resultadoBusqueda && (
          <button
            type="button"
            className="admin-btn-secondary"
            onClick={handleLimpiarBusqueda}
          >
            Limpiar búsqueda
          </button>
        )}
      </form>

      {errorBusqueda && (
        <p className="admin-msg" style={{ color: "red" }}>
          {errorBusqueda}
        </p>
      )}

      {/* 👇 CAMBIO CLAVE: solo muestro el bloque si NO hay ventaExpandida */}
      {resultadoBusqueda && !ventaExpandida && (
        <div className="admin-box" style={{ marginBottom: "15px" }}>
          <p>
            <strong>Resultado:</strong> Venta #{resultadoBusqueda.id} — Total: $
            {resultadoBusqueda.totalVenta}
          </p>
          <p>
            <strong>Fecha:</strong> {resultadoBusqueda.fechaCompra}{" "}
            <strong>Hora:</strong> {resultadoBusqueda.horaCompra}
          </p>
          <p>
            <strong>Método de Pago:</strong>{" "}
            {resultadoBusqueda.metodoPagoNombre ?? "N/A"}
          </p>
          <button
            className="admin-btn"
            type="button"
            onClick={() => {
              // al ver detalle, abro el panel derecho y limpio el bloque de resultado
              setVentaExpandida(resultadoBusqueda);
              setResultadoBusqueda(null);
              setErrorBusqueda("");
            }}
          >
            Ver detalle
          </button>
        </div>
      )}

      {/* ========== LAYOUT FLEX PARA LISTA + DETALLE ========= */}
      <div className={`ventas-layout ${ventaExpandida ? "con-detalle" : ""}`}>
        {/* ================= TABLA PRINCIPAL ================= */}
        <div className="ventas-lista">
          {loading && <p className="admin-msg">Cargando ventas...</p>}
          {error && (
            <p className="admin-msg" style={{ color: "red" }}>
              {error}
            </p>
          )}

          {!loading && ventas.length > 0 && (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Fecha</th>
                  <th>Total</th>
                  <th>Usuario</th>
                  <th>Método de Pago</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {ventas.map((v) => (
                  <tr key={v.id}>
                    <td>{v.id}</td>
                    <td>
                      {v.fechaCompra}
                      <br />
                      <small>{v.horaCompra}</small>
                    </td>
                    <td>${v.totalVenta}</td>
                    <td>{v.usuarioId ?? "N/A"}</td>
                    <td>{v.metodoPagoNombre ?? "N/A"}</td>
                    <td>
                      <button
                        className="admin-btn"
                        onClick={() => {
                          setVentaExpandida(v);
                          // por si venías de una búsqueda previa
                          setResultadoBusqueda(null);
                          setErrorBusqueda("");
                        }}
                      >
                        Ver detalle
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {!loading && ventas.length === 0 && (
            <p className="admin-msg">No hay ventas registradas.</p>
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
        </div>

        {/* ================= PANEL DE DETALLE ================= */}
        {ventaExpandida && (
          <div className="ventas-detalle">
            <h3 className="admin-title" style={{ fontSize: "20px" }}>
              Detalle de la Venta #{ventaExpandida.id}
            </h3>

            <div className="admin-box">
              <p>
                <strong>Fecha:</strong> {ventaExpandida.fechaCompra}
              </p>
              <p>
                <strong>Hora:</strong> {ventaExpandida.horaCompra}
              </p>
              <p>
                <strong>Total:</strong> ${ventaExpandida.totalVenta}
              </p>
              <p>
                <strong>Método de Pago:</strong>{" "}
                {ventaExpandida.metodoPagoNombre}
              </p>
              <p>
                <strong>ID Usuario:</strong> {ventaExpandida.usuarioId}
              </p>
            </div>

            <table className="admin-table" style={{ marginTop: "15px" }}>
              <thead>
                <tr>
                  <th>ID Detalle</th>
                  <th>ID Producto</th>
                  <th>Cantidad</th>
                  <th>Precio Unitario</th>
                  <th>Subtotal</th>
                </tr>
              </thead>

              <tbody>
                {ventaExpandida.detalles?.map((d) => (
                  <tr key={d.id}>
                    <td>{d.id}</td>
                    <td>{d.productoId}</td>
                    <td>{d.cantidad}</td>
                    <td>${d.precioUnitario}</td>
                    <td>${d.cantidad * d.precioUnitario}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button
              className="admin-btn-secondary cerrar-detalle-btn"
              onClick={() => setVentaExpandida(null)}
            >
              Cerrar detalle
            </button>
          </div>
        )}
      </div>
    </div>
  );
}