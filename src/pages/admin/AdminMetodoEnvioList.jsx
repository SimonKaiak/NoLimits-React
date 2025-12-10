// Ruta: src/pages/admin/AdminMetodoEnvioList.jsx

import React, { useEffect, useState } from "react";
import { ButtonAction } from "../../components/atoms/ButtonAction.jsx";
import CrearMetodoEnvio from "../../components/organisms/CrearMetodoEnvio";
import {
  listarMetodosEnvio,
  eliminarMetodoEnvio,
  obtenerMetodoEnvio,
} from "../../services/metodosEnvio";

/**
 * AdminMetodoEnvioList
 *
 * Página de administración para gestionar los Métodos de Envío.
 * Permite:
 * - Buscar métodos de envío.
 * - Crear nuevos métodos.
 * - Editar métodos existentes.
 * - Eliminar métodos.
 * - Listarlos con paginación.
 *
 * Se conecta con el backend mediante el archivo metodosEnvio.js
 * para obtener, crear, editar o eliminar información.
 */
export default function AdminMetodoEnvioList() {

  // Lista actual de métodos de envío obtenidos del backend
  const [metodos, setMetodos] = useState([]);

  // Valor que realmente se usa como filtro al llamar al backend
  const [busqueda, setBusqueda] = useState("");

  // Valor temporal que el usuario escribe en el input
  const [busquedaTemp, setBusquedaTemp] = useState("");

  // Página actual usada para la paginación
  const [pagina, setPagina] = useState(1);

  // Total de páginas (dependerá del backend)
  const [totalPaginas, setTotalPaginas] = useState(1);

  // Indica si se está cargando información
  const [loading, setLoading] = useState(false);

  // Control del modal para crear/editar
  // null => modo listado | objeto => modo formulario (crear/editar)
  const [modalData, setModalData] = useState(null);


  /**
   * useEffect
   * Se ejecuta cada vez que cambian:
   * - la página
   * - el filtro de búsqueda real
   *
   * Esto permite actualizar automáticamente la tabla.
   * Solo se ejecuta si NO estamos en modo formulario.
   */
  useEffect(() => {
    if (!modalData) {
      cargarMetodos();
    }
  }, [pagina, busqueda, modalData]);


  /**
   * Cargar métodos de envío desde el backend
   * usando la página actual y el filtro de búsqueda.
   */
  async function cargarMetodos() {
    setLoading(true);

    try {
      const data = await listarMetodosEnvio(pagina, busqueda);

      // contenido viene en data.contenido según la API
      setMetodos(data.contenido || []);

      // totalPaginas viene del backend
      setTotalPaginas(data.totalPaginas || 1);

    } catch (err) {
      console.error(err);
      alert("❌ Error al cargar métodos de envío");
    }

    setLoading(false);
  }


  /**
   * Eliminar un método de envío.
   * Solicita confirmación y luego llama al backend.
   */
  const handleEliminar = async (id) => {
    if (!window.confirm("¿Eliminar método de envío?")) return;

    try {
      await eliminarMetodoEnvio(id);

      // Recargamos la lista desde el backend
      await cargarMetodos();

      alert("Método eliminado!");

    } catch (err) {
      alert("❌ Error al eliminar método de envío");
    }
  };


  /**
   * Abre el modal de edición cargando primero
   * los datos del método de envío desde el backend.
   */
  const abrirModalEditar = async (fila) => {
    try {
      const metodo = await obtenerMetodoEnvio(fila.id);

      setModalData({
        modo: "editar",
        metodo,
      });

    } catch (err) {
      alert("❌ Error al obtener método de envío");
    }
  };

  /**
   * Cierra el formulario (crear/editar) y vuelve al listado,
   * recargando los datos con el filtro actual.
   */
  const volverAlListado = () => {
    setModalData(null);
    cargarMetodos();
  };


  /**
   * Render principal de la página
   */
  return (
    <div className="admin-wrapper">

      <h1 className="admin-title">Gestionar Métodos de Envío</h1>

      {modalData ? (
        // ==============================
        // MODO FORMULARIO (CREAR/EDITAR)
        // ==============================
        <CrearMetodoEnvio
          modo={modalData.modo}
          metodo={modalData.metodo}
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
                // cuando se hace click recién se aplica el filtro
                setBusqueda(busquedaTemp);
                setPagina(1);
              }}
            />
          </div>

          {/* Botón Crear */}
          <div className="admin-form">
            <ButtonAction
              text="Crear Método de Envío"
              onClick={() => setModalData({ modo: "crear", metodo: null })}
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

              {/* Estado cargando */}
              {loading ? (
                <tr>
                  <td colSpan="4" className="admin-msg">
                    Cargando...
                  </td>
                </tr>
              ) :

              /* Sin resultados */
              metodos.length === 0 ? (
                <tr>
                  <td colSpan="4" className="admin-msg">
                    No hay resultados
                  </td>
                </tr>
              ) :

              /* Resultados */
              metodos.map((m) => (
                <tr key={m.id}>
                  <td>{m.id}</td>
                  <td>{m.nombre}</td>
                  <td>{m.activo ? "Sí" : "No"}</td>

                  <td className="admin-actions">
                    <ButtonAction text="Editar" onClick={() => abrirModalEditar(m)} />
                    <ButtonAction text="Eliminar" onClick={() => handleEliminar(m.id)} />
                  </td>
                </tr>
              ))}

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