import React from "react";
import { ButtonAction } from "../atoms/ButtonAction";

/**
 * Componente DetalleUsuario
 *
 * Muestra información completa de un usuario dentro de un modal:
 *  - Sus datos personales (nombre, correo, teléfono, dirección)
 *  - Su cantidad total de compras
 *  - El detalle de cada compra realizada
 *
 * Este componente se usa en la vista de administración para revisar
 * la información asociada a un usuario.
 */
export default function DetalleUsuario({ usuario, onCerrar }) {

    /**
     * totalCompras:
     * Calcula cuántas compras tiene el usuario.
     *
     * usuario.ventasAsociadas puede existir o ser undefined.
     * Por eso usamos "?." y "??" para evitar errores.
     */
    const totalCompras = usuario.ventasAsociadas?.length ?? 0;

    return (
        <div className="modal-bg">
            <div className="modal-content detalle-usuario">

                {/* Título principal del modal */}
                <h2>Detalle del Usuario</h2>

                {/* Datos personales básicos */}
                <p><strong>Nombre completo:</strong> {usuario.nombreCompleto}</p>
                <p><strong>Correo:</strong> {usuario.correo}</p>
                <p><strong>Teléfono:</strong> {usuario.telefono}</p>

                {/* Dirección general del usuario */}
                <p>
                    <strong>Dirección:</strong>
                    {usuario.comuna?.nombre}, {usuario.region?.nombre}
                </p>

                {/* Sección de compras realizadas */}
                <h3>Compras del Usuario</h3>

                {/* Cantidad total de compras */}
                <p>
                    <strong>Total de compras:</strong> {totalCompras}
                </p>

                {/* Si no tiene compras, mostramos un mensaje */}
                {totalCompras === 0 && (
                    <p>No tiene compras asociadas.</p>
                )}

                {/*
                    Si el usuario tiene compras, recorremos cada una
                    usando .map() para mostrar su detalle.
                */}
                {usuario.ventasAsociadas?.map((v) => (
                    <div key={v.id} className="venta-card">

                        <p><strong>ID compra:</strong> {v.id}</p>
                        <p><strong>Fecha:</strong> {v.fechaCompra}</p>
                        <p><strong>Hora:</strong> {v.horaCompra}</p>
                        <p><strong>Subtotal:</strong> ${v.subtotal}</p>
                        <p><strong>Total:</strong> ${v.totalVenta}</p>

                        <p><strong>Método Pago:</strong> {v.metodoPago?.nombre}</p>
                        <p><strong>Método Envío:</strong> {v.metodoEnvio?.nombre}</p>

                        {/* Línea separadora entre compras */}
                        <hr />
                    </div>
                ))}

                {/* Botón para cerrar el modal */}
                <ButtonAction text="Cerrar" onClick={onCerrar} />
            </div>
        </div>
    );
}
