// Se importa React para poder usar JSX y componentes
import React from "react";

// Botón reutilizable para acciones
import { ButtonAction } from "../atoms/ButtonAction";

// Componente que muestra los detalles de la compra realizada
import { DetallesCompra } from "./DetallesCompra";

// Muestra un mensaje de confirmación de compra exitosa
import { MensajeConfirmacion } from "../atoms/MensajeConfirmacion";

// Hook para navegar entre rutas
import { useNavigate } from "react-router-dom";

/**
 * Componente AccionCompra
 *
 * Este componente representa la pantalla final después de que
 * una compra se realiza exitosamente.
 *
 * Agrupa:
 *  - Un mensaje de confirmación.
 *  - Una sección que muestra los detalles de la compra.
 *  - Un botón para volver al inicio.
 *
 * Parámetros (props):
 *  - producto: nombre o información del producto comprado.
 *  - precio: monto pagado.
 *  - fecha: fecha en que se realizó la compra.
 */
export const AccionCompra = ({ producto, precio, fecha }) => {
  // Permite mover al usuario a otra página
  const navigate = useNavigate();

  // Función que redirige al usuario a la vista principal
  const volverInicio = () => navigate("/principal");

  return (
    <section className="accion-compra">
      {/* Mensaje superior indicando que la compra fue exitosa */}
      <MensajeConfirmacion />

      {/* Detalle del producto, precio y fecha que se compró */}
      <DetallesCompra
        producto={producto}
        precio={precio}
        fecha={fecha}
      />

      {/* Botón que permite volver a la página principal */}
      <ButtonAction
        text="Volver al inicio"
        onClick={volverInicio}
      />
    </section>
  );
};
