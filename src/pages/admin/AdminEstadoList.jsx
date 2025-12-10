// Ruta: src/pages/admin/AdminEstadoList.jsx

import React, { useEffect, useState } from "react";
import { ButtonAction } from "../../components/atoms/ButtonAction.jsx";
import CrearEstado from "../../components/organisms/CrearEstado";
import { listarEstados, eliminarEstado, obtenerEstado } from "../../services/estados";

/**
 * AdminEstadoList
 *
 * Esta página permite administrar los estados del sistema.
 * Un estado puede ser algo como: "Pendiente", "Pagado", "Enviado", etc.
 *
 * Desde aquí puedes:
 * - Listar todos los estados
 * - Buscar por nombre
 * - Crear un nuevo estado
 * - Editar uno existente
 * - Eliminar un estado
 */
export default function AdminEstadoList() {

  // Lista de estados que se muestra en la tabla
  const [estados, setEstados] = useState([]);

  // Texto que el usuario escribe en el input del buscador
  const [busquedaInput, setBusquedaInput] = useState("");

  // Filtro real aplicado para buscar (solo cambia cuando se presiona "Buscar")
  const [filtroBusqueda, setFiltroBusqueda] = useState("");

  // Página actual (por ahora siempre 1 porque el backend no pagina)
  const [pagina, setPagina] = useState(1);

  // Total de páginas (simulado)
  const [totalPaginas, setTotalPaginas] = useState(1);

  // Indica si se está esperando respuesta del backend
  const [loading, setLoading] = useState(false);

  // Información para abrir el modal y saber si es crear o editar
  // null => modo listado, objeto => modo crear/editar
  const [modalData, setModalData] = useState(null);

  /**
   * Cada vez que cambie la página o el filtro, cargamos los estados.
   * Solo se ejecuta cuando estamos en modo listado (sin formulario abierto).
   */
  useEffect(() => {
    if (!modalData) {
      cargarEstados(filtroBusqueda);
    }
  }, [pagina, filtroBusqueda, modalData]);

  /**
   * Función que llama al backend para obtener los estados.
   * Si el backend devuelve un objeto con "contenido", se usa ese.
   * Si devuelve una lista directa, también se acepta.
   */
  async function cargarEstados(filtro = "") {
    setLoading(true);

    try {
      const data = await listarEstados(pagina, filtro);

      setEstados(data.contenido || []);
      setTotalPaginas(data.totalPaginas || 1);

    } catch (err) {
      alert("Error al cargar estados");
    }

    setLoading(false);
  }

  /**
   * Aplica realmente el filtro cuando el usuario presiona el botón Buscar.
   */
  const handleBuscarClick = () => {
    setPagina(1);
    setFiltroBusqueda(busquedaInput);
  };

  /**
   * Elimina un estado por ID.
   * Antes pide confirmación al usuario.
   */
  const handleEliminar = async (id) => {
    if (!window.confirm("¿Eliminar estado?")) return;

    try {
      await eliminarEstado(id);

      // Actualizamos la lista eliminando el estado borrado sin recargar todo
      setEstados((prev) => prev.filter((e) => e.id !== id));

      alert("Estado eliminado");
    } catch (err) {
      alert("Error al eliminar estado");
    }
  };

  /**
   * Abre el modal de edición.
   * Primero trae del backend todos los datos del estado.
   */
  const abrirModalEditar = async (fila) => {
    try {
      const est = await obtenerEstado(fila.id);
      setModalData({
        modo: "editar",
        estado: est,
      });
    } catch {
      alert("Error al obtener estado");
    }
  };

  // Función que se pasa al formulario para volver al listado
  const volverAlListado = () => {
    // Cerramos modal
    setModalData(null);
    // Volvemos a recargar respetando el filtro actual
    cargarEstados(filtroBusqueda);
  };

  return (
    <div className="admin-wrapper">

      <h1 className="admin-title">Gestionar Estados</h1>

      {modalData ? (
        // ============================
        // MODO FORMULARIO (CREAR/EDITAR)
        // ============================
        <CrearEstado
          modo={modalData.modo}
          estado={modalData.estado}
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
              value={busquedaInput}
              onChange={(e) => setBusquedaInput(e.target.value)}
              className="admin-input"
            />

            <ButtonAction text="Buscar" onClick={handleBuscarClick} />
          </div>

          {/* Botón crear estado */}
          <div className="admin-form">
            <ButtonAction
              text="Crear Estado"
              onClick={() =>
                setModalData({
                  modo: "crear",
                  estado: null,
                })
              }
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
              {/* Estado: cargando */}
              {loading ? (
                <tr>
                  <td colSpan="4" className="admin-msg">Cargando...</td>
                </tr>

              ) : estados.length === 0 ? (

                // No hay registros
                <tr>
                  <td colSpan="4" className="admin-msg">No hay resultados</td>
                </tr>

              ) : (

                // Mostrar registros
                estados.map((e) => (
                  <tr key={e.id}>
                    <td>{e.id}</td>
                    <td>{e.nombre}</td>
                    <td>{e.activo ? "Sí" : "No"}</td>

                    <td className="admin-actions">
                      <ButtonAction text="Editar" onClick={() => abrirModalEditar(e)} />
                      <ButtonAction text="Eliminar" onClick={() => handleEliminar(e.id)} />
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