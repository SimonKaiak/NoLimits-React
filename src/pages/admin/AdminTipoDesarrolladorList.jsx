// Ruta: src/pages/admin/AdminTipoDesarrolladorList.jsx

import React, { useEffect, useState } from "react";
import { ButtonAction } from "../../components/atoms/ButtonAction.jsx";
import CrearTipoDesarrollador from "../../components/organisms/CrearTipoDesarrollador.jsx";
import {
  listarTiposDesarrollador,
  eliminarTipoDesarrollador,
  obtenerTipoDesarrollador,
} from "../../services/tiposDesarrollador.js";
import "../../styles/adminBase.css";

/**
 * AdminTipoDesarrolladorList
 *
 * Pantalla de administración para los Tipos de Desarrollador.
 * Aquí se puede:
 *  - Buscar tipos de desarrollador por nombre
 *  - Listar resultados paginados
 *  - Crear un nuevo tipo de desarrollador
 *  - Editar uno existente
 *  - Eliminar uno existente
 *
 * Esta pantalla usa un buscador manual: el usuario escribe, pero
 * la búsqueda real solo se ejecuta cuando presiona el botón “Buscar”
 * o presiona Enter.
 */
export default function AdminTipoDesarrolladorList() {
  
  // Lista de tipos obtenidos desde el backend.
  const [tipos, setTipos] = useState([]);

  // Texto que escribe el usuario en el input.
  const [busqueda, setBusqueda] = useState("");

  // Filtro real aplicado a la consulta.
  const [filtro, setFiltro] = useState("");

  // Control de paginación.
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  // Indica si se está cargando la información.
  const [loading, setLoading] = useState(false);

  // Datos para abrir el modal (crear o editar).
  // null => modo listado, objeto => modo formulario
  const [modalData, setModalData] = useState(null);

  /**
   * Cargar datos cada vez que cambian:
   * - la página actual
   * - el filtro aplicado
   * Solo se ejecuta cuando NO estamos en modo formulario.
   */
  useEffect(() => {
    if (!modalData) {
      cargarTipos();
    }
  }, [pagina, filtro, modalData]);

  /**
   * Cargar lista desde backend.
   * Usa el valor de "filtro" para buscar,
   * no el texto que el usuario está escribiendo.
   */
  async function cargarTipos() {
    setLoading(true);

    try {
      const data = await listarTiposDesarrollador(pagina, filtro);

      setTipos(data.contenido || []);
      setTotalPaginas(data.totalPaginas || 1);

    } catch (err) {
      console.error(err);
      alert("❌ Error al cargar tipos de desarrollador");
    }

    setLoading(false);
  }

  /**
   * Ejecuta la búsqueda real.
   * Aplica el texto escrito y reinicia la página a 1.
   */
  const handleClickBuscar = () => {
    setPagina(1);
    setFiltro(busqueda);
  };

  /**
   * Eliminar un tipo por ID.
   */
  const handleEliminar = async (id) => {
    if (!window.confirm("¿Eliminar este tipo de desarrollador?")) return;

    try {
      await eliminarTipoDesarrollador(id);
      setTipos((prev) => prev.filter((t) => t.id !== id));
      alert("Tipo de desarrollador eliminado");
    } catch (err) {
      console.error(err);
      alert("❌ No se pudo eliminar el tipo de desarrollador");
    }
  };

  /**
   * Abrir modal en modo edición.
   * Se obtiene el tipo seleccionado desde backend.
   */
  const abrirModalEditar = async (fila) => {
    try {
      const tipo = await obtenerTipoDesarrollador(fila.id);

      setModalData({
        modo: "editar",
        tipo,
      });
    } catch (err) {
      console.error(err);
      alert("❌ Error al obtener tipo de desarrollador");
    }
  };

  /**
   * Función que se pasa al formulario para volver al listado
   * después de crear o editar.
   */
  const volverAlListado = () => {
    setModalData(null);
    cargarTipos(); // recargar resultados después de cerrar
  };

  /**
   * Renderizado principal.
   */
  return (
    <div className="admin-wrapper">
      <h1 className="admin-title">Gestionar Tipo de Desarrollador</h1>

      {modalData ? (
        // ============================
        // MODO FORMULARIO (CREAR/EDITAR)
        // ============================
        <CrearTipoDesarrollador
          modo={modalData.modo}
          tipo={modalData.tipo}
          onCerrar={volverAlListado}
        />
      ) : (
        // ============================
        // MODO LISTADO
        // ============================
        <>
          {/* Buscador */}
          <div className="admin-form">
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="admin-input"

              // Permitir buscar con Enter
              onKeyDown={(e) => {
                if (e.key === "Enter") handleClickBuscar();
              }}
            />
            <ButtonAction text="Buscar" onClick={handleClickBuscar} />
          </div>

          {/* Crear nuevo tipo */}
          <div className="admin-form">
            <ButtonAction
              text="Crear Tipo de Desarrollador"
              onClick={() =>
                setModalData({
                  modo: "crear",
                  tipo: null,
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
              ) : tipos.length === 0 ? (
                <tr>
                  <td colSpan="3" className="admin-msg">No hay resultados</td>
                </tr>
              ) : (
                tipos.map((t) => (
                  <tr key={t.id}>
                    <td>{t.id}</td>
                    <td>{t.nombre}</td>
                    <td className="admin-actions">
                      <ButtonAction text="Editar" onClick={() => abrirModalEditar(t)} />
                      <ButtonAction text="Eliminar" onClick={() => handleEliminar(t.id)} />
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
              onClick={() => setPagina((prev) => prev - 1)}
            />

            <span className="admin-page-info">
              Página {pagina} / {totalPaginas}
            </span>

            <ButtonAction
              text="Siguiente"
              disabled={pagina >= totalPaginas}
              onClick={() => setPagina((prev) => prev + 1)}
            />
          </div>
        </>
      )}
    </div>
  );
}