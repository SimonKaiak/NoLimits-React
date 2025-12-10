// Ruta: src/pages/admin/AdminGeneroList.jsx
import React, { useEffect, useState } from "react";
import { ButtonAction } from "../../components/atoms/ButtonAction.jsx";
import CrearGenero from "../../components/organisms/CrearGenero";
import {
  listarGeneros,
  eliminarGenero,
  obtenerGenero,
} from "../../services/generos";
import "../../styles/adminBase.css";

/**
 * AdminGeneroList
 *
 * Página para administrar géneros del sistema.
 * Un "género" puede representar categorías como Acción, Terror, Aventura, etc.
 *
 * Desde esta vista se puede:
 * - Mostrar la lista de géneros
 * - Buscar por nombre
 * - Crear un nuevo género
 * - Editar un género existente
 * - Eliminar un género de la base de datos
 */
export default function AdminGeneroList() {

  // Lista actual de géneros que se mostrará en la tabla
  const [generos, setGeneros] = useState([]);

  // Lo que el usuario escribe en el input del buscador
  const [busquedaInput, setBusquedaInput] = useState("");

  // Filtro real que se usa para llamar al backend.
  // Solo se actualiza cuando se hace clic en "Buscar".
  const [filtroBusqueda, setFiltroBusqueda] = useState("");

  // Página actual (el backend no pagina, pero el código queda preparado)
  const [pagina, setPagina] = useState(1);

  // Total de páginas (por ahora es siempre 1)
  const [totalPaginas, setTotalPaginas] = useState(1);

  // Estado que indica si estamos esperando una respuesta del backend
  const [loading, setLoading] = useState(false);

  // Información usada para abrir el modal
  // Puede contener un modo ("crear" | "editar") y los datos del género
  // null => modo listado | objeto => modo formulario (crear/editar)
  const [modalData, setModalData] = useState(null);

  /**
   * Cada vez que cambie "pagina" o "filtroBusqueda",
   * se vuelve a cargar la lista de géneros desde el backend.
   * Solo se ejecuta si NO estamos en modo formulario.
   */
  useEffect(() => {
    if (!modalData) {
      cargarGeneros(filtroBusqueda);
    }
  }, [pagina, filtroBusqueda, modalData]);

  /**
   * Llama al backend para obtener los géneros.
   * Soporta dos formas posibles de respuesta:
   * - Un array directo
   * - Un objeto que contiene un campo "contenido"
   */
  async function cargarGeneros(filtro = "") {
    setLoading(true);
    try {
      const data = await listarGeneros(pagina, filtro);

      setGeneros(data.contenido || []);
      setTotalPaginas(data.totalPaginas || 1);

    } catch (err) {
      console.error(err);
      alert("Error al cargar géneros");
    }
    setLoading(false);
  }

  /**
   * Aplica la búsqueda solo cuando el usuario presiona el botón "Buscar".
   */
  const handleBuscarClick = () => {
    setPagina(1);
    setFiltroBusqueda(busquedaInput);
  };

  /**
   * Elimina un género por ID.
   * Antes pregunta al usuario si está seguro.
   */
  const handleEliminar = async (id) => {
    if (!window.confirm("¿Eliminar género?")) return;

    try {
      await eliminarGenero(id);

      // Eliminamos el género localmente sin recargar todo
      setGeneros((prev) => prev.filter((g) => g.id !== id));

      alert("Género eliminado");
    } catch (err) {
      console.error(err);
      alert("Error al eliminar género");
    }
  };

  /**
   * Abre el modal con los datos del género seleccionado para edición.
   */
  const abrirModalEditar = async (fila) => {
    try {
      const gen = await obtenerGenero(fila.id);
      setModalData({
        modo: "editar",
        genero: gen,
      });
    } catch (err) {
      console.error(err);
      alert("Error al obtener género");
    }
  };

  /**
   * Cierra el formulario (crear/editar) y vuelve al listado,
   * recargando los géneros según el filtro actual.
   */
  const volverAlListado = () => {
    setModalData(null);
    cargarGeneros(filtroBusqueda); // recarga respetando el filtro actual
  };

  return (
    <div className="admin-wrapper">
      <h1 className="admin-title">Gestionar Géneros</h1>

      {modalData ? (
        // ===========================================
        // MODO FORMULARIO (CREAR / EDITAR GÉNERO)
        // ===========================================
        <CrearGenero
          modo={modalData.modo}
          genero={modalData.genero}
          onCerrar={volverAlListado}
        />
      ) : (
        // ===========================================
        // MODO LISTADO (BUSCADOR + TABLA + PAGINACIÓN)
        // ===========================================
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
              text="Crear Género"
              onClick={() =>
                setModalData({
                  modo: "crear",
                  genero: null,
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
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {/* Estado de carga */}
              {loading ? (
                <tr>
                  <td colSpan="3" className="admin-msg">
                    Cargando...
                  </td>
                </tr>

              ) : generos.length === 0 ? (

                // Sin resultados
                <tr>
                  <td colSpan="3" className="admin-msg">
                    No hay resultados
                  </td>
                </tr>

              ) : (

                // Mostrar lista
                generos.map((g) => (
                  <tr key={g.id}>
                    <td>{g.id}</td>
                    <td>{g.nombre}</td>

                    <td className="admin-actions">
                      <ButtonAction text="Editar" onClick={() => abrirModalEditar(g)} />
                      <ButtonAction text="Eliminar" onClick={() => handleEliminar(g.id)} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Paginación (simulada) */}
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