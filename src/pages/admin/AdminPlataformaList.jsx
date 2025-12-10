// Ruta: src/pages/admin/AdminPlataformaList.jsx

import React, { useEffect, useState } from "react";
import { ButtonAction } from "../../components/atoms/ButtonAction.jsx";
import CrearPlataforma from "../../components/organisms/CrearPlataforma";
import {
  listarPlataformas,
  eliminarPlataforma,
  obtenerPlataforma,
} from "../../services/plataformas";

/**
 * AdminPlataformaList
 *
 * Página de administración para la entidad "Plataforma".
 * Permite:
 *  Listar plataformas
 *  Buscar plataformas por nombre
 *  Crear nuevas plataformas
 *  Editar plataformas existentes
 *  Eliminar plataformas
 *
 * Usa un modal para crear/editar y un filtro controlado que solo se aplica
 * al presionar el botón de "Buscar".
 */
export default function AdminPlataformaList() {
  // Lista completa de plataformas obtenidas desde el backend
  const [plataformas, setPlataformas] = useState([]);

  // Texto que el usuario escribe en el input (no activa búsqueda)
  const [busquedaInput, setBusquedaInput] = useState("");

  // Filtro real aplicado a la búsqueda (este sí llama al backend)
  const [filtroBusqueda, setFiltroBusqueda] = useState("");

  // Paginación (placeholder, tu backend no pagina aún)
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  // Indicador de carga
  const [loading, setLoading] = useState(false);

  // Control del modal (crear/editar)
  // null => modo listado, objeto => modo crear/editar
  const [modalData, setModalData] = useState(null);

  /**
   * Se ejecuta cada vez que cambian:
   *  - la página seleccionada
   *  - el filtro real de búsqueda
   *
   * Esto permite recargar automáticamente el listado.
   * Solo se ejecuta cuando NO estamos en modo formulario.
   */
  useEffect(() => {
    if (!modalData) {
      cargarPlataformas(filtroBusqueda);
    }
  }, [pagina, filtroBusqueda, modalData]);

  /**
   * Cargar la lista de plataformas desde el backend.
   * Se aplican tanto la página como el filtro de búsqueda.
   */
  async function cargarPlataformas(filtro = "") {
    setLoading(true);

    try {
      const data = await listarPlataformas(pagina, filtro);

      setPlataformas(data.contenido || []);
      setTotalPaginas(data.totalPaginas || 1);

    } catch (err) {
      console.error(err);
      alert("❌ Error al cargar plataformas");
    }

    setLoading(false);
  }

  /**
   * Aplicar búsqueda únicamente cuando el usuario presiona "Buscar".
   */
  const handleBuscarClick = () => {
    setPagina(1);
    setFiltroBusqueda(busquedaInput);
  };

  /**
   * Eliminar una plataforma por ID.
   */
  const handleEliminar = async (id) => {
    if (!window.confirm("¿Eliminar esta plataforma?")) return;

    try {
      await eliminarPlataforma(id);

      // Actualización local sin recargar todo
      setPlataformas((prev) => prev.filter((p) => p.id !== id));

      alert("Plataforma eliminada!");

    } catch (err) {
      console.error(err);
      alert("❌ Error al eliminar");
    }
  };

  /**
   * Abrir modal para editar.
   * Primero obtiene la plataforma desde el backend para asegurar datos frescos.
   */
  const abrirModalEditar = async (fila) => {
    try {
      const plat = await obtenerPlataforma(fila.id);

      setModalData({
        modo: "editar",
        plataforma: plat,
      });
    } catch (err) {
      console.error(err);
      alert("❌ Error al obtener plataforma");
    }
  };

  /**
   * Función que se pasa al formulario para volver al listado
   * después de crear o editar.
   */
  const volverAlListado = () => {
    setModalData(null);
    cargarPlataformas(filtroBusqueda);
  };

  /**
   * Render del componente principal.
   */
  return (
    <div className="admin-wrapper">
      <h1 className="admin-title">Gestionar Plataformas</h1>

      {modalData ? (
        // =============================
        // MODO FORMULARIO (CREAR/EDITAR)
        // =============================
        <CrearPlataforma
          modo={modalData.modo}
          plataforma={modalData.plataforma}
          onCerrar={volverAlListado}
        />
      ) : (
        // =============================
        // MODO LISTADO
        // =============================
        <>
          {/* Buscador */}
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

          {/* Crear nueva plataforma */}
          <div className="admin-form">
            <ButtonAction
              text="Crear Plataforma"
              onClick={() =>
                setModalData({
                  modo: "crear",
                  plataforma: null,
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
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="3" className="admin-msg">Cargando...</td>
                </tr>
              ) : plataformas.length === 0 ? (
                <tr>
                  <td colSpan="3" className="admin-msg">No hay resultados</td>
                </tr>
              ) : (
                plataformas.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.nombre}</td>

                    <td className="admin-actions">
                      <ButtonAction text="Editar" onClick={() => abrirModalEditar(p)} />
                      <ButtonAction text="Eliminar" onClick={() => handleEliminar(p.id)} />
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