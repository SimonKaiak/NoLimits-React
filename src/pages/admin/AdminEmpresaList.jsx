// Ruta: src/pages/admin/AdminEmpresaList.jsx
import React, { useEffect, useState } from "react";
import { ButtonAction } from "../../components/atoms/ButtonAction.jsx";
import CrearEmpresa from "../../components/organisms/CrearEmpresa";

import {
  listarEmpresas,
  eliminarEmpresa,
  obtenerEmpresa,
} from "../../services/empresas";

/**
 * AdminEmpresaList
 *
 * Pantalla de administración para gestionar empresas.
 * Permite:
 * - Listar empresas
 * - Buscar por nombre
 * - Crear nuevas empresas
 * - Editar empresas existentes
 * - Eliminar empresas
 *
 * El backend aún no tiene paginación real, por lo que se simula con 1 página.
 */
export default function AdminEmpresaList() {
  // Lista total que muestra la tabla
  const [empresas, setEmpresas] = useState([]);

  // Texto escrito por el usuario (input controlado)
  const [busquedaInput, setBusquedaInput] = useState("");

  // Filtro aplicado realmente al cargar datos
  const [filtroBusqueda, setFiltroBusqueda] = useState("");

  // Página actual (placeholder)
  const [pagina, setPagina] = useState(1);

  // Total de páginas (por ahora fijo a 1)
  const [totalPaginas, setTotalPaginas] = useState(1);

  // Estado de carga
  const [loading, setLoading] = useState(false);

  // Datos para abrir el modal (crear/editar)
  // null => modo listado | objeto => modo formulario
  const [modalData, setModalData] = useState(null);

  /**
   * Carga empresas cada vez que cambie la página o el filtro real.
   * Solo se ejecuta si NO estamos en modo formulario (crear/editar).
   */
  useEffect(() => {
    if (!modalData) {
      cargarEmpresas(filtroBusqueda);
    }
  }, [pagina, filtroBusqueda, modalData]);

  /**
   * Función que obtiene los datos desde el backend.
   * El parámetro "filtro" es aplicado al nombre.
   */
  async function cargarEmpresas(filtro = "") {
    setLoading(true);
    try {
      const data = await listarEmpresas(pagina, filtro);

      setEmpresas(data.contenido || []);
      setTotalPaginas(data.totalPaginas || 1);

    } catch (err) {
      console.error(err);
      alert("Error al cargar empresas");
    }
    setLoading(false);
  }

  /**
   * Aplica la búsqueda cuando se presiona el botón.
   * El usuario puede escribir sin recargar hasta hacer click.
   */
  const handleBuscarClick = () => {
    setPagina(1);
    setFiltroBusqueda(busquedaInput);
  };

  /**
   * Elimina una empresa por ID.
   * Luego refresca la tabla sin recargar toda la lista.
   */
  const handleEliminar = async (id) => {
    if (!window.confirm("¿Eliminar empresa?")) return;

    try {
      await eliminarEmpresa(id);

      // Actualizamos la lista local quitando ese registro
      setEmpresas((prev) => prev.filter((e) => e.id !== id));

      alert("Empresa eliminada");
    } catch (err) {
      console.error(err);
      alert("Error al eliminar empresa");
    }
  };

  /**
   * Abre el modal de edición:
   * Primero obtiene todos los datos de la empresa seleccionada.
   */
  const abrirModalEditar = async (row) => {
    try {
      const empresa = await obtenerEmpresa(row.id);
      setModalData({ modo: "editar", empresa });
    } catch (err) {
      console.error(err);
      alert("Error al obtener empresa");
    }
  };

  /**
   * Cierra el formulario (crear/editar) y vuelve al listado,
   * recargando los datos según el filtro actual.
   */
  const volverAlListado = () => {
    setModalData(null);
    cargarEmpresas(filtroBusqueda);
  };

  return (
    <div className="admin-wrapper">
      <h1 className="admin-title">Gestionar Empresas</h1>

      {modalData ? (
        // ====================================
        // MODO FORMULARIO (CREAR / EDITAR)
        // ====================================
        <CrearEmpresa
          modo={modalData.modo}
          empresa={modalData.empresa}
          onCerrar={volverAlListado}
        />
      ) : (
        // ====================================
        // MODO LISTADO (BUSCADOR + TABLA)
        // ====================================
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

          {/* Botón crear */}
          <div className="admin-form">
            <ButtonAction
              text="Crear Empresa"
              onClick={() => setModalData({ modo: "crear", empresa: null })}
            />
          </div>

          {/* Tabla principal */}
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
              {/* Estado cargando */}
              {loading ? (
                <tr>
                  <td colSpan="4" className="admin-msg">Cargando...</td>
                </tr>

              ) : empresas.length === 0 ? (

                // No hay datos
                <tr>
                  <td colSpan="4" className="admin-msg">No hay resultados</td>
                </tr>

              ) : (

                // Listado real
                empresas.map((e) => (
                  <tr key={e.id}>
                    <td>{e.id}</td>
                    <td>{e.nombre}</td>
                    <td>{e.activo ? "Sí" : "No"}</td>

                    <td className="admin-actions">
                      <ButtonAction
                        text="Editar"
                        onClick={() => abrirModalEditar(e)}
                      />

                      <ButtonAction
                        text="Eliminar"
                        onClick={() => handleEliminar(e.id)}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Paginación placeholder */}
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