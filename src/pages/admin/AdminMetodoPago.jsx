// Ruta: src/pages/admin/AdminMetodoPagoList.jsx

import React, { useEffect, useState } from "react";
import { ButtonAction } from "../../components/atoms/ButtonAction.jsx";
import CrearMetodoPago from "../../components/organisms/CrearMetodoPago";
import { listarMetodosPago, eliminarMetodoPago, obtenerMetodoPago } from "../../services/metodosPago";

/**
 * AdminMetodoPagoList
 *
 * Página para la administración de los Métodos de Pago.
 * Permite realizar operaciones CRUD:
 * - Buscar métodos de pago.
 * - Crear nuevos métodos.
 * - Editar métodos existentes.
 * - Eliminar métodos registrados.
 *
 * También incorpora paginación y usa un modal para crear/editar.
 */
export default function AdminMetodoPagoList() {

    // Lista actual de métodos de pago obtenidos desde el backend
    const [metodos, setMetodos] = useState([]);

    // Filtro real aplicado a la búsqueda
    const [busqueda, setBusqueda] = useState("");

    // Valor temporal que el usuario escribe en el input
    const [busquedaTemp, setBusquedaTemp] = useState("");

    // Página actual para la paginación
    const [pagina, setPagina] = useState(1);

    // Total de páginas entregado por el backend
    const [totalPaginas, setTotalPaginas] = useState(1);

    // Estado de carga
    const [loading, setLoading] = useState(false);

    // Control del modal (crear o editar)
    // null => modo listado, objeto => modo formulario
    const [modalData, setModalData] = useState(null);

    /**
     * useEffect
     * Se ejecuta cada vez que cambian:
     * - la página
     * - el filtro de búsqueda
     *
     * Esto asegura que la tabla se actualice automáticamente.
     * Solo se ejecuta cuando NO estamos en modo formulario.
     */
    useEffect(() => {
        if (!modalData) {
            cargarMetodos();
        }
    }, [pagina, busqueda, modalData]);


    /**
     * Cargar los métodos de pago desde el backend
     * aplicando paginación y filtro.
     */
    async function cargarMetodos() {
        setLoading(true);

        try {
            const data = await listarMetodosPago(pagina, busqueda);

            setMetodos(data.contenido || []);
            setTotalPaginas(data.totalPaginas || 1);

        } catch (err) {
            alert("❌ Error al cargar métodos de pago");
        }

        setLoading(false);
    }


    /**
     * Eliminar un método de pago.
     * Solicita confirmación, y luego actualiza la lista.
     */
    const handleEliminar = async (id) => {
        if (!window.confirm("¿Eliminar método de pago?")) return;

        try {
            await eliminarMetodoPago(id);

            await cargarMetodos();
            alert("Método eliminado!");

        } catch (err) {
            alert("❌ Error al eliminar");
        }
    };


    /**
     * Abrir el modal en modo edición.
     * Primero se obtiene el método desde el backend para asegurar datos actualizados.
     */
    const abrirModalEditar = async (fila) => {
        try {
            const metodo = await obtenerMetodoPago(fila.id);

            setModalData({
                modo: "editar",
                metodo,
            });

        } catch (err) {
            alert("❌ Error al obtener método de pago");
        }
    };

    /**
     * Función que se pasa al formulario para volver al listado
     * después de crear o editar.
     */
    const volverAlListado = () => {
        setModalData(null);
        cargarMetodos(); // recarga al cerrar
    };


    /**
     * Render del componente principal.
     */
    return (
        <div className="admin-wrapper">

            <h1 className="admin-title">Gestionar Métodos de Pago</h1>

            {modalData ? (
                // ============================
                // MODO FORMULARIO (CREAR/EDITAR)
                // ============================
                <CrearMetodoPago
                    modo={modalData.modo}
                    metodo={modalData.metodo}
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
                            value={busquedaTemp}
                            onChange={(e) => setBusquedaTemp(e.target.value)}
                            className="admin-input"
                        />

                        <ButtonAction
                            text="Buscar"
                            onClick={() => {
                                // el filtro real se aplica solo al presionar buscar
                                setBusqueda(busquedaTemp);
                                setPagina(1);
                            }}
                        />
                    </div>

                    {/* Crear nuevo método */}
                    <div className="admin-form">
                        <ButtonAction
                            text="Crear Método de Pago"
                            onClick={() =>
                                setModalData({ modo: "crear", metodo: null })
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

                            {/* Estado cargando */}
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="admin-msg">Cargando...</td>
                                </tr>

                            ) : metodos.length === 0 ? (

                                /* Sin resultados */
                                <tr>
                                    <td colSpan="4" className="admin-msg">No hay resultados</td>
                                </tr>

                            ) : (

                                /* Mostrar resultados */
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