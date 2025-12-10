// Ruta: src/pages/admin/AdminDesarrolladorList.jsx
import React, { useEffect, useState } from "react";
import { ButtonAction } from "../../components/atoms/ButtonAction.jsx";
import CrearDesarrollador from "../../components/organisms/CrearDesarrollador";
import {
  listarDesarrolladores,
  eliminarDesarrollador,
  obtenerDesarrollador,
} from "../../services/desarrolladores";

/**
 * AdminDesarrolladorList
 *
 * Esta página permite:
 * - Listar desarrolladores
 * - Buscar por nombre
 * - Crear nuevos desarrolladores
 * - Editar los existentes
 * - Eliminar desarrolladores
 *
 * Además usa una pequeña paginación.
 */
export default function AdminDesarrolladorList() {

  // Lista total recibida del backend
  const [lista, setLista] = useState([]);

  // Texto aplicado como filtro real
  const [busqueda, setBusqueda] = useState("");

  // Texto que el usuario escribe en el input, pero sin aplicar
  const [busquedaTemp, setBusquedaTemp] = useState("");

  // Número de página actual
  const [pagina, setPagina] = useState(1);

  // Total de páginas que entrega el backend
  const [totalPaginas, setTotalPaginas] = useState(1);

  // Estado de carga
  const [loading, setLoading] = useState(false);

  // Datos para abrir el modal de Crear/Editar
  // null => modo listado | objeto => modo formulario (crear/editar)
  const [modalData, setModalData] = useState(null);

  /**
   * useEffect que se ejecuta cada vez que cambia
   * la página o el filtro de búsqueda.
   * Solo se ejecuta si NO estamos en modo formulario.
   */
  useEffect(() => {
    if (!modalData) {
      cargarDesarrolladores();
    }
  }, [pagina, busqueda, modalData]);

  /**
   * Función principal que pide los datos al backend.
   * Actualiza la tabla y la paginación.
   */
  async function cargarDesarrolladores() {
    setLoading(true);

    try {
      const data = await listarDesarrolladores(pagina, busqueda);

      // La API devuelve "contenido" y "totalPaginas"
      setLista(data.contenido || []);
      setTotalPaginas(data.totalPaginas || 1);

    } catch (err) {
      alert("Error al cargar desarrolladores");
    }

    setLoading(false);
  }

  /**
   * Elimina un desarrollador por su ID.
   * Pide confirmación antes de hacerlo.
   */
  const handleEliminar = async (id) => {
    if (!window.confirm("¿Eliminar desarrollador?")) return;

    try {
      await eliminarDesarrollador(id);

      // Recarga la tabla después de eliminar
      await cargarDesarrolladores();

      alert("Desarrollador eliminado");
    } catch (err) {
      alert("Error al eliminar");
    }
  };

  /**
   * Abre el modal de edición.
   * Primero obtiene del backend todos los datos del registro.
   */
  const abrirModalEditar = async (item) => {
    try {
      const dev = await obtenerDesarrollador(item.id);

      setModalData({
        modo: "editar",
        desarrollador: dev,
      });

    } catch (err) {
      alert("Error al obtener desarrollador");
    }
  };

  /**
   * Cierra el formulario (crear/editar) y vuelve al listado,
   * recargando los datos con el filtro actual.
   */
  const volverAlListado = () => {
    setModalData(null);
    cargarDesarrolladores();
  };

  // Render principal
  return (
    <div className="admin-wrapper">

      <h1 className="admin-title">Gestionar Desarrolladores</h1>

      {modalData ? (
        // ==============================
        // MODO FORMULARIO (CREAR/EDITAR)
        // ==============================
        <CrearDesarrollador
          modo={modalData.modo}
          desarrollador={modalData.desarrollador}
          onCerrar={volverAlListado}
        />
      ) : (
        // ==============================
        // MODO LISTADO
        // ==============================
        <>
          {/* Buscador */}
          <div className="admin-form">
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={busquedaTemp}
              onChange={(e) => setBusquedaTemp(e.target.value)}
              className="admin-input"
            />

            <ButtonAction
              text="Buscar"
              onClick={() => {
                // La búsqueda real cambia solo al presionar el botón
                setBusqueda(busquedaTemp);
                setPagina(1);
              }}
            />
          </div>

          {/* Botón para crear */}
          <div className="admin-form">
            <ButtonAction
              text="Crear Desarrollador"
              onClick={() =>
                setModalData({
                  modo: "crear",
                  desarrollador: null,
                })
              }
            />
          </div>

          {/* Tabla */}
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
                  <td colSpan="4" className="admin-msg">
                    Cargando...
                  </td>
                </tr>

              ) : lista.length === 0 ? (

                // Sin resultados
                <tr>
                  <td colSpan="4" className="admin-msg">
                    No hay resultados
                  </td>
                </tr>

              ) : (

                // Resultados
                lista.map((d) => (
                  <tr key={d.id}>
                    <td>{d.id}</td>
                    <td>{d.nombre}</td>
                    <td>{d.activo ? "Si" : "No"}</td>

                    <td className="admin-actions">
                      <ButtonAction
                        text="Editar"
                        onClick={() => abrirModalEditar(d)}
                      />

                      <ButtonAction
                        text="Eliminar"
                        onClick={() => handleEliminar(d.id)}
                      />
                    </td>
                  </tr>
                ))
              )}

            </tbody>
          </table>

          {/* Controles de paginación */}
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