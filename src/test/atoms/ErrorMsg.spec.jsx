import React from "react";
import { render, screen } from "@testing-library/react";
import { ErrorMsg } from "../../components/atoms/ErrorMsg.jsx";

/**
 * Este archivo contiene pruebas unitarias para el componente ErrorMsg.
 * 
 * ErrorMsg es un pequeño componente que muestra un mensaje de error dentro
 * de un elemento <span>. Este mensaje puede estar vacío o contener texto,
 * pero el <span> siempre debe existir para mantener la estructura del formulario.
 * 
 * Además, el componente usa atributos de accesibilidad como role="alert"
 * y aria-live="polite", los cuales permiten que lectores de pantalla
 * detecten correctamente cambios en el mensaje.
 */
describe("Atom: ErrorMsg", () => {

  /**
   * Esta prueba revisa que el componente siempre renderice el <span>,
   * incluso cuando el mensaje recibido es una cadena vacía.
   * 
   * El role="alert" permite identificar el <span> sin importar su contenido.
   */
  it("debe renderizar el span siempre, aunque el mensaje esté vacío", () => {
    render(<ErrorMsg message="" />);

    const span = screen.getByRole("alert");
    expect(span).toBeTruthy();
  });

  /**
   * Esta prueba revisa que cuando se envía un mensaje,
   * el componente lo muestre correctamente dentro del <span>.
   */
  it("debe mostrar el mensaje cuando se envía uno", () => {
    render(<ErrorMsg message="Campo requerido" />);

    const span = screen.getByRole("alert");

    // Se verifica que el texto mostrado sea exactamente el enviado
    expect(span.textContent.trim()).toBe("Campo requerido");
  });

  /**
   * Esta prueba revisa que si el mensaje es una cadena vacía,
   * el <span> también debe mostrar cadena vacía.
   */
  it("debe mostrar cadena vacía cuando message=''", () => {
    render(<ErrorMsg message="" />);

    const span = screen.getByRole("alert");

    // Se usan trim() para eliminar espacios invisibles
    expect(span.textContent.trim()).toBe("");
  });

  /**
   * Esta prueba revisa que el componente incluya la clase CSS "error-msg",
   * que es usada para aplicar estilo al texto del mensaje.
   */
  it("debe tener la clase CSS correcta", () => {
    render(<ErrorMsg message="Error" />);

    const span = screen.getByRole("alert");

    expect(span.classList.contains("error-msg")).toBeTrue();
  });

  /**
   * Esta prueba revisa que el <span> tenga el atributo aria-live="polite".
   * Este atributo indica a los lectores de pantalla que deben anunciar el cambio
   * de manera no intrusiva.
   */
  it("debe tener el atributo aria-live='polite'", () => {
    render(<ErrorMsg message="Error" />);

    const span = screen.getByRole("alert");

    expect(span.getAttribute("aria-live")).toBe("polite");
  });

  /**
   * Esta prueba verifica que el componente establezca un id específico.
   * Esto puede ser útil para enlazar el mensaje con un campo del formulario.
   */
  it("debe tener el id='errorMsg'", () => {
    render(<ErrorMsg message="Ups" />);

    const span = screen.getByRole("alert");

    expect(span.getAttribute("id")).toBe("errorMsg");
  });

});