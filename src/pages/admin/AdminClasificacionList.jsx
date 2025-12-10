import React, { useEffect, useState } from "react";
import { ButtonAction } from "../../components/atoms/ButtonAction.jsx";
import CrearClasificacion from "../../components/organisms/CrearClasificacion";
import {
  listarClasificaciones,
  eliminarClasificacion,
  obtenerClasificacion,
} from "../../services/clasificaciones";
import "../../styles/adminBase.css";

/**
 * Componente AdminClasificacionList
 *
 * Esta pantalla permite:
 * - Ver todas las clasificaciones registradas.
 * - Buscar clasificaciones por su nombre.
 * - Crear nuevas clasificaciones.
 * - Editar clasificaciones existentes.
 * - Eliminar clasificaciones.
 *
 * También maneja un pequeño sistema de paginación.
 */
export default function AdminClasificacionList() {

  const [clasificaciones, setClasificaciones] = useState([]);
  const [busquedaInput, setBusquedaInput] = useState("");
  const [filtroBusqueda, setFiltroBusqueda] = useState("");
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [loading, setLoading] = useState(false);

  // null => modo listado | objeto => modo crear/editar
  const [modalData, setModalData] = useState(null);

  /**
   * Carga las clasificaciones cuando cambia la página o el filtro,
   * pero solo si estamos en modo listado (sin formulario abierto).
   */
  useEffect(() => {
    if (!modalData) {
      cargarClasificaciones(filtroBusqueda);
    }
  }, [pagina, filtroBusqueda, modalData]);

  async function cargarClasificaciones(filtro = "") {
    setLoading(true);
    try {
      const data = await listarClasificaciones(pagina, filtro);
      setClasificaciones(data.contenido || []);
      setTotalPaginas(data.totalPaginas || 1);
    } catch (err) {
      console.error(err);
      alert("Error al cargar clasificaciones");
    }
    setLoading(false);
  }

  const handleBuscarClick = () => {
    setPagina(1);
    setFiltroBusqueda(busquedaInput);
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Eliminar clasificación?")) return;

    try {
      await eliminarClasificacion(id);
      setClasificaciones((prev) => prev.filter((c) => c.id !== id));
      alert("Clasificación eliminada");
    } catch (err) {
      console.error(err);
      alert("Error al eliminar");
    }
  };

  const abrirModalEditar = async (fila) => {
    try {
      const clasif = await obtenerClasificacion(fila.id);
      setModalData({
        modo: "editar",
        clasificacion: clasif,
      });
    } catch (err) {
      console.error(err);
      alert("Error al obtener clasificación");
    }
  };

  const volverAlListado = () => {
    setModalData(null);
    cargarClasificaciones(filtroBusqueda);
  };

  return (
    <div className="admin-wrapper">
      <h1 className="admin-title">Gestionar Clasificaciones</h1>

      {modalData ? (
        // =============================
        // MODO FORMULARIO (CREAR/EDITAR)
        // =============================
        <CrearClasificacion
          modo={modalData.modo}
          clasificacion={modalData.clasificacion}
          onCerrar={volverAlListado}
        />
      ) : (
        // =============================
        // MODO LISTADO
        // =============================
        <>
          {/* Cuadro de búsqueda */}
          <div className="admin-form">
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={busquedaInput}
              onChange={(e) => setBusquedaInput(e.target.value)}
              className="admin-input"
            />
            <ButtonAction text="Buscar" onClick={handleBuscarClick} />
          </div>

          {/* Botón para crear un registro */}
          <div className="admin-form">
            <ButtonAction
              text="Crear Clasificación"
              onClick={() =>
                setModalData({
                  modo: "crear",
                  clasificacion: null,
                })
              }
            />
          </div>

          {/* Tabla de resultados */}
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Activo</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="admin-msg">
                    Cargando...
                  </td>
                </tr>
              ) : clasificaciones.length === 0 ? (
                <tr>
                  <td colSpan="4" className="admin-msg">
                    No hay resultados
                  </td>
                </tr>
              ) : (
                clasificaciones.map((c) => (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td>{c.nombre}</td>
                    <td>{c.activo ? "Sí" : "No"}</td>
                    <td>
                      <div className="admin-actions">
                        <button
                          className="admin-action-btn admin-action-edit"
                          onClick={() => abrirModalEditar(c)}
                        >
                          Editar
                        </button>
                        <button
                          className="admin-action-btn admin-action-delete"
                          onClick={() => handleEliminar(c.id)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Paginación */}
          <div className="admin-pagination">
            <ButtonAction
              text="Anterior"
              disabled={pagina <= 1}
              onClick={() => setPagina((p) => p - 1)}
            />

            <span className="admin-page-info">
              Página {pagina} / {totalPaginas}
            </span>

            <ButtonAction
              text="Siguiente"
              disabled={pagina >= totalPaginas}
              onClick={() => setPagina((p) => p + 1)}
            />
          </div>
        </>
      )}
    </div>
  );
}