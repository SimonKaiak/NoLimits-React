// Ruta: src/pages/admin/AdminTipoEmpresaList.jsx

import React, { useEffect, useState } from "react";
import { ButtonAction } from "../../components/atoms/ButtonAction.jsx";
import CrearTipoEmpresa from "../../components/organisms/CrearTipoEmpresa.jsx";

import {
  listarTiposEmpresa,
  eliminarTipoEmpresa,
  obtenerTipoEmpresa,
} from "../../services/tiposEmpresa.js";

import "../../styles/adminBase.css";

/**
 * AdminTipoEmpresaList
 *
 * Módulo de administración para gestionar los Tipos de Empresa.
 * Permite:
 *  - Listar tipos de empresa paginados
 *  - Buscar por nombre
 *  - Crear un nuevo tipo de empresa
 *  - Editar un tipo existente
 *  - Eliminar un tipo existente
 *
 * El componente usa un sistema de búsqueda "confirmada":
 * El usuario escribe en el input, pero la búsqueda real solo se aplica
 * cuando se presiona el botón "Buscar" o Enter.
 */
export default function AdminTipoEmpresaList() {
  /** Lista actual mostrada en la tabla */
  const [tipos, setTipos] = useState([]);

  /** Texto que escribe el usuario en el input */
  const [busqueda, setBusqueda] = useState("");

  /** Filtro REAL aplicado al backend */
  const [filtro, setFiltro] = useState("");

  /** Estados para paginación */
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  /** Indica si se está cargando información */
  const [loading, setLoading] = useState(false);

  /** Datos para abrir el modal (crear/editar)
   *  null => modo listado
   *  objeto => modo formulario (crear/editar)
   */
  const [modalData, setModalData] = useState(null);

  /**
   * useEffect principal:
   * Se ejecuta cada vez que cambia la página o el filtro aplicado.
   * Obtiene la lista de tipos desde el backend.
   * Solo se ejecuta cuando NO estamos en modo formulario.
   */
  useEffect(() => {
    if (!modalData) {
      cargarTipos();
    }
  }, [pagina, filtro, modalData]);

  /**
   * Carga los tipos de empresa desde el backend usando
   * el filtro y la página actual.
   */
  async function cargarTipos() {
    setLoading(true);
    try {
      const data = await listarTiposEmpresa(pagina, filtro);

      /**
       * El backend devuelve:
       * {
       *   contenido: [...],
       *   totalPaginas: X
       * }
       */
      setTipos(Array.isArray(data) ? data : data.contenido || []);
      setTotalPaginas(data.totalPaginas || 1);
    } catch (err) {
      console.error(err);
      alert("❌ Error al cargar tipos de empresa");
    }
    setLoading(false);
  }

  /**
   * Aplica el texto ingresado como filtro real.
   * - Reinicia la página a 1.
   * - Ejecuta nueva carga en el useEffect.
   */
  const handleClickBuscar = () => {
    setPagina(1);
    setFiltro(busqueda);
  };

  /**
   * Elimina un tipo de empresa por ID.
   * Solicita confirmación antes de eliminar.
   */
  const handleEliminar = async (id) => {
    if (!window.confirm("¿Eliminar este tipo de empresa?")) return;

    try {
      await eliminarTipoEmpresa(id);

      // Actualiza solo el estado local.
      setTipos((prev) => prev.filter((t) => t.id !== id));

      alert("Tipo de empresa eliminado");
    } catch (err) {
      console.error(err);
      alert("❌ No se pudo eliminar el tipo de empresa");
    }
  };

  /**
   * Obtiene un tipo de empresa por ID y abre el modal en modo edición.
   */
  const abrirModalEditar = async (fila) => {
    try {
      const tipo = await obtenerTipoEmpresa(fila.id);

      setModalData({
        modo: "editar",
        tipo,
      });
    } catch (err) {
      console.error(err);
      alert("❌ Error al obtener tipo de empresa");
    }
  };

  /**
   * Función usada por el formulario para volver al listado
   * después de crear o editar.
   */
  const volverAlListado = () => {
    setModalData(null);
    cargarTipos();
  };

  return (
    <div className="admin-wrapper">

      <h1 className="admin-title">Gestionar Tipos de Empresa</h1>

      {modalData ? (
        // ==============================
        // MODO FORMULARIO (CREAR/EDITAR)
        // ==============================
        <CrearTipoEmpresa
          modo={modalData.modo}
          tipo={modalData.tipo}
          onCerrar={volverAlListado}
        />
      ) : (
        // ==============================
        // MODO LISTADO
        // ==============================
        <>
          {/* ----------------------------- */}
          {/* BUSCADOR                     */}
          {/* ----------------------------- */}
          <div className="admin-form">
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="admin-input"
              // Permitir ejecutar búsqueda con Enter
              onKeyDown={(e) => {
                if (e.key === "Enter") handleClickBuscar();
              }}
            />

            <ButtonAction text="Buscar" onClick={handleClickBuscar} />
          </div>

          {/* ----------------------------- */}
          {/* BOTÓN CREAR                 */}
          {/* ----------------------------- */}
          <div className="admin-form">
            <ButtonAction
              text="Crear Tipo de Empresa"
              onClick={() =>
                setModalData({
                  modo: "crear",
                  tipo: null,
                })
              }
            />
          </div>

          {/* ----------------------------- */}
          {/* TABLA                        */}
          {/* ----------------------------- */}
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
                      <ButtonAction
                        text="Editar"
                        onClick={() => abrirModalEditar(t)}
                      />

                      <ButtonAction
                        text="Eliminar"
                        onClick={() => handleEliminar(t.id)}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* ----------------------------- */}
          {/* PAGINACIÓN                   */}
          {/* ----------------------------- */}
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