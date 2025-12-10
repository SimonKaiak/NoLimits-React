import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ButtonAction } from "../../components/atoms/ButtonAction.jsx";

/**
 * Este archivo contiene pruebas unitarias para el componente ButtonAction.
 * 
 * ButtonAction es un botón reutilizable que acepta propiedades como:
 * - text: el texto que se mostrará dentro del botón
 * - onClick: una función que se ejecuta cuando se hace clic
 * - disabled: desactiva el botón cuando es true
 * - className: permite agregar clases CSS personalizadas
 * - variant: permite agregar un atributo adicional, por ejemplo "danger"
 * 
 * Estas pruebas verifican que el botón se muestre correctamente y que
 * responda adecuadamente a las interacciones del usuario.
 */
describe("Atom: ButtonAction", () => {

  /**
   * Esta prueba revisa que el botón muestre correctamente el texto
   * que se envía mediante la propiedad "text".
   */
  it("debe renderizar el texto correctamente", () => {
    render(<ButtonAction text="Enviar" />);

    // Se busca el texto dentro del botón
    expect(screen.getByText("Enviar")).toBeTruthy();
  });

  /**
   * Esta prueba revisa que la función enviada en la propiedad "onClick"
   * se ejecute cuando el usuario hace clic en el botón.
   * 
   * Para esto se usa jasmine.createSpy, que permite detectar si la función fue llamada.
   */
  it("debe ejecutar onClick cuando se hace click", () => {
    const clickSpy = jasmine.createSpy("clickSpy");

    render(<ButtonAction text="Guardar" onClick={clickSpy} />);

    const btn = screen.getByText("Guardar");

    // Se simula un clic
    fireEvent.click(btn);

    // Se revisa que la función haya sido llamada
    expect(clickSpy).toHaveBeenCalled();
  });

  /**
   * Esta prueba revisa que si el botón tiene la propiedad disabled=true,
   * entonces la función onClick NO se debe ejecutar aunque el usuario haga clic.
   */
  it("no debe ejecutar onClick si disabled=true", () => {
    const clickSpy = jasmine.createSpy("clickSpy");

    render(<ButtonAction text="Guardar" onClick={clickSpy} disabled={true} />);

    const btn = screen.getByText("Guardar");

    // Se intenta hacer clic en el botón deshabilitado
    fireEvent.click(btn);

    // La función NO debe llamarse
    expect(clickSpy).not.toHaveBeenCalled();
  });

  /**
   * Esta prueba revisa que cuando se envía una clase CSS mediante "className",
   * el botón realmente la reciba y la incluya en su lista de clases.
   */
  it("debe aplicar la clase enviada mediante className", () => {
    render(
      <ButtonAction
        text="Descargar"
        className="btn-test"
      />
    );

    const btn = screen.getByText("Descargar");

    // Se revisa que el botón tenga la clase CSS
    expect(btn.classList.contains("btn-test")).toBeTrue();
  });

  /**
   * Esta prueba revisa que si se envía la propiedad "variant",
   * esta quede aplicada como un atributo dentro del elemento HTML.
   * 
   * Jasmine no tiene un método directo como "toHaveAttribute",
   * por lo que se usa getAttribute para revisar manualmente.
   */
  it("debe aplicar el atributo variant cuando se envía", () => {
    render(
      <ButtonAction
        text="Aceptar"
        variant="danger"
      />
    );

    const btn = screen.getByText("Aceptar");

    // Se revisa que el atributo exista con el valor correcto
    expect(btn.getAttribute("variant")).toBe("danger");
  });

  /**
   * Esta prueba revisa que si se envía la propiedad disabled=true,
   * el botón aparezca deshabilitado (disabled).
   */
  it("debe estar disabled cuando se envía disabled=true", () => {
    render(
      <ButtonAction
        text="Procesando..."
        disabled={true}
      />
    );

    const btn = screen.getByText("Procesando...");

    // Se revisa que el botón esté realmente deshabilitado
    expect(btn.disabled).toBeTrue();
  });

});