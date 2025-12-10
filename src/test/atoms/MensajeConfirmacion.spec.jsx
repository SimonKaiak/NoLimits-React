import React from "react";
import { render, screen } from "@testing-library/react";
import { MensajeConfirmacion } from "../../components/atoms/MensajeConfirmacion.jsx";

/**
 * Este archivo contiene pruebas unitarias para el componente MensajeConfirmacion.
 *
 * MensajeConfirmacion es un componente que muestra un mensaje visual para indicar
 * que una compra se realizó correctamente. Incluye:
 * - un título principal
 * - un mensaje secundario de agradecimiento
 * - un contenedor con una clase CSS específica
 *
 * Las pruebas verifican que todo el contenido se muestre de forma correcta
 * y que el componente mantenga su estructura base.
 */
describe("Atom: MensajeConfirmacion", () => {

  /**
   * Esta prueba revisa que el contenedor principal del componente exista.
   * Se obtiene el div contenedor usando el texto principal como referencia
   * y luego buscando su elemento padre más cercano.
   */
  it("debe renderizar el contenedor principal", () => {
    render(<MensajeConfirmacion />);

    const container = screen.getByText("¡Compra realizada con éxito!").closest("div");

    expect(container).toBeTruthy();
  });

  /**
   * Esta prueba verifica que el título principal se muestre exactamente
   * como debe aparecer en la interfaz.
   */
  it("debe mostrar el título correctamente", () => {
    render(<MensajeConfirmacion />);

    expect(screen.getByText("¡Compra realizada con éxito!")).toBeTruthy();
  });

  /**
   * Esta prueba revisa que el mensaje secundario esté presente.
   * Este mensaje entrega información adicional al usuario.
   */
  it("debe mostrar el mensaje secundario", () => {
    render(<MensajeConfirmacion />);

    expect(
      screen.getByText(
        "Gracias por tu preferencia! Te enviaremos un correo con los detalles de tu compra."
      )
    ).toBeTruthy();
  });

  /**
   * Esta prueba verifica que el contenedor principal tenga la clase CSS correcta.
   * Esta clase se utiliza para aplicar los estilos propios del mensaje.
   */
  it("debe tener la clase CSS 'mensaje-confirmacion'", () => {
    render(<MensajeConfirmacion />);

    const container = screen.getByText("¡Compra realizada con éxito!").closest("div");

    expect(container.classList.contains("mensaje-confirmacion")).toBeTrue();
  });

});